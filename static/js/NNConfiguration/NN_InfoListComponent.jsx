import React from 'react';
import Api from './../utils/Api'
import Modal from 'react-modal';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

import ReportRepository from './../repositories/ReportRepository'
import StepArrowComponent from './../NNLayout/common/StepArrowComponent'

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
        });   
    }

    deleteCommonNNInfo(params) {
        let nn_id = ''
        let re = confirm( "Are you delete?" )

        if(re == true){
            for (var i in this.refs.table.state.data) {
                if (this.refs.table.state.selectedRowKeys == this.refs.table.state.data[i].nn_id){
                    nn_id = this.refs.table.state.data[i].nn_id
                }
            }
            console.log(nn_id)
            params = { use_flag : 'N' }
            this.props.reportRepository.putCommonNNInfo(nn_id, params).then((tableData) => {
                this.getCommonNNInfo();
            });
        }
    }


    updateCommonNNInfo(params){   
        let nn_id = ''
        let bc = ''
        let bc_sub = ''
        let bc_title = ''
        let bc_desc = ''
        let re = confirm( "Are you update?" )
        if(re == true){
            console.log(this.refs.table.state.selectedRowKeys )
            for (var i in this.refs.table.state.data) {
                if (this.refs.table.state.selectedRowKeys == this.refs.table.state.data[i].nn_id){
                    nn_id = this.refs.table.state.data[i].nn_id
                    bc = this.refs.table.state.data[i].biz_cate
                    bc_sub = this.refs.table.state.data[i].biz_sub_cate
                    bc_title = this.refs.table.state.data[i].nn_title
                    bc_desc = this.refs.table.state.data[i].nn_desc
                }
            }
            
            params = { biz_cate : bc, biz_sub_cate : bc_sub, nn_title: bc_title, nn_desc :bc_desc }
            this.props.reportRepository.putCommonNNInfo(nn_id, params).then((tableData) => {
                this.getCommonNNInfo();
            });
        }
    }

    trainCommonNNInfo(params) {
        console.log(this.refs.table.state.selectedRowKeys)
        for (var i in this.refs.table.state.data) {
            if (this.refs.table.state.selectedRowKeys == this.refs.table.state.data[i].nn_id){
                console.log(this.refs.table.state.data[i])
            }
        }
    }

    addCommonNNInfo(params) {
        console.log(this.refs.table.state.selectedRowKeys)
        return this.props.getHeaderEvent(4); //call Net Info
        // this.setState({<NN_InfoNewComponent /> });   
    }

    render() {
        const selectRowProp = {
            mode: 'radio',
            clickToSelect: true,
            onSelect: onSelectRow,
            thisClass : this
        }

        const options = {
            defaultSortName: 'nn_id',
            defaultSortOrder: 'asc'
        }

        const cellEditProp = {
            mode: 'click',
            blurToSave: true
        }

        function onSelectRow(row) {
            console.log("row info : " + row.nn_id)
            console.log(this.thisClass.props )
            console.log(this.thisClass.getCommonNNInfo )
            this.thisClass.props.setActiveItem(row.nn_id,
                                               row.key,
                                               row.type,
                                               row.datavaild,
                                               row.config,
                                               row.confvaild,
                                               row.train,
                                               row.preprocess,
                                               row.name);
        }

        function deleteFormatter(cell, row, props) {
            // console.log(this.thisClass.getCommonNNInfo )
          return (
            <DeleteFormatter active={ row } ppp={this.thisClass}/>
          );
        }

        function modifyFormatter(cell, row, enumObject, index) {
          return (
            <ModifyFormatter active={ row } />
          );
        }

        function trainFormatter(cell, row, enumObject, index) {
          return (
            <TrainFormatter active={ row } />
          );
        }


        let result = [];

        if (this.state.NN_TableData != null) {
            for (var i in this.state.NN_TableData) {
                result[i] = this.state.NN_TableData[i];
            }
        }

// <NN_InfoListTableComponent TableData={this.state.NN_TableData} TableColumn={columns} ref="child"/>
// <button type="button" className="detail" onClick={() => this.getCommonNNInfo()} >Detail</button>
        // <TableHeaderColumn dataField='nn_id' dataFormat={ deleteFormatter }  dataAlign='center' 
        //                     editable={ false } >Delete</TableHeaderColumn>
        // <TableHeaderColumn dataField='nn_id' dataFormat={ modifyFormatter }  dataAlign='center' 
        //                     editable={ false } >Modify</TableHeaderColumn>
        // <TableHeaderColumn dataField='nn_id' dataFormat={ trainFormatter }  dataAlign='center' 
        //                     editable={ false } >Train</TableHeaderColumn>
        // <button type="button" className="addnew" onClick={() => this.trainCommonNNInfo()} >Train</button>
        return (
            <section>
                <h1 className="hidden">tensor MSA main table</h1>
                <div className="container paddingT10">
                    <div className="tblBtnArea">
                        
                        <button type="button" className="addnew" onClick={() => this.addCommonNNInfo() } >Add New</button>
                    </div>

                    <div className="tblBtnArea">
                        <button type="button" className="search" onClick={() => this.getCommonNNInfo()} >Search</button>               
                        <button type="button" className="delete" onClick={() => this.deleteCommonNNInfo()} >Delete</button>
                        <button type="button" className="modify" onClick={() => this.updateCommonNNInfo()} >Modify</button>
                        
                    </div>

                    <div className="net-info">
                        
<table className="form-table align-left">
    <BootstrapTable ref= 'table' 
        data={result} 
        options={ options } 
        striped={true} 
        hover={true} 
        condensed={true} 
        pagination 
        multiColumnSort={ 3 } 
        selectRow={selectRowProp}
        cellEdit={ cellEditProp } 
        search = {true}
        multiColumnSearch={true}
        data-resizable = {true}
        >
        
        <TableHeaderColumn dataField="biz_cate" dataSort={ true } headerAlign='center' dataAlign='center' 
                            >Category</TableHeaderColumn>
        <TableHeaderColumn dataField="biz_sub_cate" dataSort={ true } headerAlign='center' dataAlign='center' 
                            >SubCategory</TableHeaderColumn>
        <TableHeaderColumn dataField="nn_title" dataSort={ true } headerAlign='center' dataAlign='center' 
                            >Title</TableHeaderColumn>
        <TableHeaderColumn dataField="nn_desc" dataSort={ true } headerAlign='center' dataAlign='center' 
                            >Description</TableHeaderColumn>

        <TableHeaderColumn dataField="nn_id" dataSort={ true } headerAlign='center' dataAlign='center' 
                            isKey={true} >ID</TableHeaderColumn>
        <TableHeaderColumn dataField="nn_wf_ver_id" dataSort={ true } headerAlign='center' dataAlign='center' 
                            editable={ false } >Ver</TableHeaderColumn>
        <TableHeaderColumn dataField="nn_batch_ver_id" dataSort={ true } headerAlign='center' dataAlign='center' 
                            editable={ false } >Batch</TableHeaderColumn>


    </BootstrapTable>
</table>

                    </div>

                </div>
            </section>
        );
    }
}







class DeleteFormatter extends React.Component {
    constructor(props) {
        super(props);
        this.deleteCommonNNInfo = this.deleteCommonNNInfo.bind(this);
    }
    
    deleteCommonNNInfo(){ 
        let params = this.props.active.nn_id
        let jsonData = { use_flag :'N' }
        // this.props.reportRepository.putCommonNNInfo(params, jsonData).then((tableData) => {
        //     // this.getCommonNNInfo(); 
        // });
        console.log('DeleteFormatter deleteCommonNNInfo.....'+params)
        console.log(this.props)
        

    }
  render() {
    return (
      <button type="button" className="delete" onClick={() => this.deleteCommonNNInfo()} >Delete</button>
    );
  }
}


class ModifyFormatter extends React.Component {
    updateCommonNNInfo(){ 
        console.log(this.props.active)
        let nn_id = this.props.active.nn_id
        let bc = this.props.active.biz_cate
        let bc_sub = this.props.active.biz_sub_cate
        let bc_desc = this.props.active.nn_desc

        let params = { biz_cate : bc, biz_sub_cate : bc_sub, nn_desc :bc_desc }
        this.props.reportRepository.putCommonNNInfo(nn_id, params).then((tableData) => {
            // this.getCommonNNInfo();
        });

    }
  render() {
    return (
      <button type="button" className="modify" onClick={() => this.updateCommonNNInfo()} >Modify</button>
    );
  }
}

class TrainFormatter extends React.Component {
    trainCommonNNInfo(){ 
        console.log(this.props.active)
    }
  render() {
    return (
      <button type="button" className="delete" onClick={() => this.trainCommonNNInfo()} >Train</button>
    );
  }
}


NN_InfoListComponent.defaultProps = {
    reportRepository: new ReportRepository(new Api())
};

DeleteFormatter.defaultProps = {
    reportRepository: new ReportRepository(new Api())
};

ModifyFormatter.defaultProps = {
    reportRepository: new ReportRepository(new Api())
};

TrainFormatter.defaultProps = {
    reportRepository: new ReportRepository(new Api())
};