import React from 'react';
import Api from './../utils/Api'
import Modal from 'react-modal';
import ReportRepository from './../repositories/ReportRepository'
import StepArrowComponent from './../NNLayout/common/StepArrowComponent'

import NN_InfoListTableComponent from './../tables/NN_InfoListTableComponent';

export default class NN_InfoListComponent extends React.Component {
    constructor(props, context) {
        super(props);
        this.state = {
            tableData: null,
            NN_TableData: null,
            selModalView: null,
            NN_ID : null,
            stepBack : 1,
            stepForward : 2
        };
    }

    componentDidMount(){
        this.getCommonNNInfo();
        
    }

    getCommonNNInfo(params) {
        this.props.reportRepository.getCommonNNInfo(params).then((tableData) => {
            this.setState({ NN_TableData: tableData })
            console.log("getCommonNNInfo==========");
            console.log(this.state.NN_TableData)
            console.log("=========================");
        });   
    }

    deleteCommonNNInfo(params) {
        this.props.reportRepository.deleteCommonNNInfo(params).then((tableData) => {
            this.getCommonNNInfo();
        });
    }

    search_btn(){
        let limit_cnt = {}
        // limit_cnt["limits"] = 0
        // let opt_url =  this.state.baseDom + '/table/' + this.state.tableDom + '/data/'
        // this.props.reportRepository.getWdnnTableDataFromHbase(opt_url).then((tableData) => {
        //     console.log('data configuration search end')
        // if(tableData['status'] == '200'){
        //     this.setState({WdnnTableData: tableData['result']})
        // }
        // });

        // let colum_type = this.getDataframeColumnOnDataConfig()    
        this.getCommonNNInfo()
        

    }

    render() {
        const columns = [
                         {Header: 'ID', accessor: 'nn_id'}  
                         ,{Header: 'BizCategory', accessor: 'biz_cate'}
                         ,{Header: 'BizSubCategory', accessor: 'biz_sub_cate'}    
                        ] 
        // 
        return (
            <section>
                <h1 className="hidden">tensor MSA main table</h1>
                <div className="searchArea">
                    <StepArrowComponent getHeaderEvent={this.props.getHeaderEvent} stepBack={this.state.stepBack} stepForward={this.state.stepForward}/>
                </div>
                <div className="container paddingT10">
                    <div className="tblBtnArea">
                        <button type="button" className="search" onClick={() => this.search_btn()} >Search</button>
                        <button type="button" className="addnew" onClick={() => this.search_btn()} >Add New</button>
                        <button type="button" className="delete" onClick={() => this.search_btn()} >Delete</button>
                        <button type="button" className="modify" onClick={() => this.search_btn()} >Modify</button>
                        <button type="button" className="detail" onClick={() => this.search_btn()} >Detail</button>
                    </div>

                    <div className="net-info">
                        <NN_InfoListTableComponent TableData={this.state.NN_TableData} TableColumn={columns} ref="child"/>
                    </div>
                    
                </div>
            </section>
        );
    }
}

NN_InfoListComponent.defaultProps = {
    reportRepository: new ReportRepository(new Api())
};

NN_InfoListComponent.contextTypes = {
    NN_ID: React.PropTypes.string
};