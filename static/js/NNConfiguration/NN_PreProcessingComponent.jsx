import React from 'react'
import dc from 'dc'
import crossfilter from 'crossfilter'
import '../../node_modules/dc/dc.css'
import StepArrowComponent from './../NNLayout/common/StepArrowComponent'
import ReportRepository from './../repositories/ReportRepository'
import Api from './../utils/Api'
import NN_BatchComponent from './NN_BatchComponent'

export default class NN_PreProcessingComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
                        spendData : [
                {Name: 'KSS', Spent: '$40', Year: 2011},
                {Name: 'KSW', Spent: '$10', Year: 2011},
                {Name: 'BJH', Spent: '$40', Year: 2011},
                {Name: 'KSS', Spent: '$70', Year: 2012},
                {Name: 'BJH', Spent: '$20', Year: 2012},
                {Name: 'BJH', Spent: '$50', Year: 2013},
                {Name: 'KSW', Spent: '$30', Year: 2013},
                {Name: 'KGH', Spent: '$30', Year: 2013},
                {Name: 'KSS', Spent: '$40', Year: 2011},
                {Name: 'KSW', Spent: '$10', Year: 2011},
                {Name: 'BJH', Spent: '$40', Year: 2011},
                {Name: 'KSS', Spent: '$70', Year: 2012},
                {Name: 'BJH', Spent: '$20', Year: 2012},
                {Name: 'BJH', Spent: '$50', Year: 2013},
                {Name: 'KSW', Spent: '$30', Year: 2013},
                {Name: 'KGH', Spent: '$30', Year: 2013}
            ],
            stepBack : 1,
            stepForward : 3,
            NN_TableData : null,
            NN_BatchData : null
        }
    }

    componentDidMount() {
        //this.createChart(this.state.spendData);
        this.props.reportRepository.getAllNetVerInfo(this.props.nnid).then((tableData) => {
            this.setState({ NN_TableData: tableData })
        });
    }

    createChart(spendData){
        let yearRingChart   = dc.pieChart("#chart-ring-year"),
            spendHistChart  = dc.barChart("#chart-hist-spend"),
            spenderRowChart = dc.rowChart("#chart-row-spenders");
        var table = dc.dataTable('#table');
 
        spendData.forEach(function(d) {
            d.Spent = d.Spent.match(/\d+/)[0];
        });
        // set crossfilter
        var ndx = crossfilter(spendData),
            yearDim  = ndx.dimension(function(d) {return +d.Year;}),
            spendDim = ndx.dimension(function(d) {return Math.floor(d.Spent/10);}),
            nameDim  = ndx.dimension(function(d) {return d.Name;}),
            spendPerYear = yearDim.group().reduceSum(function(d) {return +d.Spent;}),
            spendPerName = nameDim.group().reduceSum(function(d) {return +d.Spent;}),
            spendHist    = spendDim.group().reduceCount();

        yearRingChart
            .width(200)
            .height(200)
            .dimension(yearDim)
            .group(spendPerYear)
            .innerRadius(40)
            .controlsUseVisibility(true);

        spendHistChart
            .dimension(spendDim)
            .group(spendHist)
            .x(d3.scale.linear().domain([0,10]))
            .elasticY(true)
            .controlsUseVisibility(true);

        spendHistChart.xAxis().tickFormat(function(d) {return d*10}); // convert back to base unit

        spendHistChart.yAxis().ticks(2);

        spenderRowChart
            .dimension(nameDim)
            .group(spendPerName)
            .elasticX(true)
            .controlsUseVisibility(true);

        var allDollars = ndx.groupAll().reduceSum(function(d) { return +d.Spent; });

        table
            .dimension(spendDim)
            .group(function(d) {
                return d.value;
            })
            .showGroups(false)
            .columns(['Name',
                    {
                        label: 'Spent',
                        format: function(d) {
                            return '$' + d.Spent;
                        }
                    },
                    'Year',
                    {
                        label: 'Percent',
                        format: function(d) {
                            return Math.floor((d.Spent / allDollars.value()) * 100) + '%';
                        }
                    }]);

        d3.select('#download')
            .on('click', function() {
                var data = nameDim.top(Infinity);
                if(d3.select('#download-type input:checked').node().value==='table') {
                    data = data.map(function(d) {
                        var row = {};
                        table.columns().forEach(function(c) {
                            row[table._doColumnHeaderFormat(c)] = table._doColumnValueFormat(c, d);
                        });
                        return row;
                    });
                }
                console.log("Table Data : " + data);
                //var blob = new Blob([d3.csv.format(data)], {type: "text/csv;charset=utf-8"});
                //saveAs(blob, 'data.csv');
            });
        dc.renderAll();
    }

    getBatch(nnid, nn_wf_ver_id){
        this.props.reportRepository.getAllNetBatchInfo(nnid,nn_wf_ver_id).then((tableData) => {
            this.setState({ NN_BatchData: tableData })
        });
    }

    render() {
        const selectRowProp = {
            mode: 'radio',
            clickToSelect: true,
            onSelect: onSelectRow,
            thisClass : this
        }

        function onSelectRow(row) {
            //this.thisClass.setState({NN_BatchData: <NN_BatchComponent nnid={this.thisClass.props.nnid} ver={row.nn_wf_ver_id}/> });
            this.thisClass.getBatch(this.thisClass.props.nnid,row.nn_wf_ver_id);
        }

        if(this.state.NN_TableData != null && this.state.NN_BatchData != null){
            return (  
                <section>
                    <div><br/><b>&nbsp;Network Info</b>
                        <BootstrapTable data={this.props.netBaseInfo} 
                            striped={true}
                            hover={true}
                            condensed={true}
                            pagination={false}
                            deleteRow={false}                           
                            search={false}>
                            <TableHeaderColumn isKey={true} dataField="nn_id">ID</TableHeaderColumn>
                            <TableHeaderColumn dataField="biz_cate">Category</TableHeaderColumn>
                            <TableHeaderColumn dataField="biz_sub_cate">Sub Category</TableHeaderColumn>
                            <TableHeaderColumn dataField="nn_title">Title</TableHeaderColumn>
                            <TableHeaderColumn dataField="nn_desc">Description</TableHeaderColumn>
                        </BootstrapTable>
                    </div>
                    <div><br/><b>&nbsp;Version Info</b>
                        <BootstrapTable data={this.state.NN_TableData} 
                            striped={true}
                            hover={true}
                            condensed={true}
                            pagination={false}
                            deleteRow={false}
                            selectRow={selectRowProp}
                            search={false}>
                            <TableHeaderColumn isKey={true} dataField="nn_wf_ver_id">ID</TableHeaderColumn>
                            <TableHeaderColumn dataField="nn_wf_ver_info">Description</TableHeaderColumn>
                            <TableHeaderColumn dataField="active_flag">Active Flag</TableHeaderColumn>
                        </BootstrapTable>
                    </div>
                    <div className='pre-tbl-wrap'><br/><b>&nbsp;Batch Info</b>
                            <BootstrapTable data={this.state.NN_BatchData} 
                                striped={true}
                                hover={true}
                                condensed={true}
                                pagination={true}
                                deleteRow={false}
                                search={false}>
                                <TableHeaderColumn isKey={true} dataField="nn_batch_ver_id">ID</TableHeaderColumn>
                                <TableHeaderColumn dataField="nn_batch_ver_info">Description</TableHeaderColumn>
                                <TableHeaderColumn dataField="active_flag">Active Flag</TableHeaderColumn>
                                <TableHeaderColumn dataField="eval_flag">Evaluation Flag</TableHeaderColumn>
                            </BootstrapTable>
                        </div>   
                </section>
            )
        }
        else if(this.state.NN_TableData != null){
            return (  
                <section>
                    <div><br/><b>&nbsp;Network Info</b>
                        <BootstrapTable data={this.props.netBaseInfo} 
                            striped={true}
                            hover={true}
                            condensed={true}
                            pagination={false}
                            deleteRow={false}                           
                            search={false}>
                            <TableHeaderColumn isKey={true} dataField="nn_id">ID</TableHeaderColumn>
                            <TableHeaderColumn dataField="biz_cate">Category</TableHeaderColumn>
                            <TableHeaderColumn dataField="biz_sub_cate">Sub Category</TableHeaderColumn>
                            <TableHeaderColumn dataField="nn_title">Title</TableHeaderColumn>
                            <TableHeaderColumn dataField="nn_desc">Description</TableHeaderColumn>
                        </BootstrapTable>
                    </div>
                    <div><br/><b>&nbsp;Version Info</b>
                        <BootstrapTable data={this.state.NN_TableData} 
                            striped={true}
                            hover={true}
                            condensed={true}
                            pagination={false}
                            deleteRow={false}
                            selectRow={selectRowProp}
                            search={false}>
                            <TableHeaderColumn isKey={true} dataField="nn_wf_ver_id">ID</TableHeaderColumn>
                            <TableHeaderColumn dataField="nn_wf_ver_info">Description</TableHeaderColumn>
                            <TableHeaderColumn dataField="active_flag">Active Flag</TableHeaderColumn>
                        </BootstrapTable>
                    </div>  
                </section>
            )
        }
        return null
    }
}

NN_PreProcessingComponent.defaultProps = {
    reportRepository: new ReportRepository(new Api())
};