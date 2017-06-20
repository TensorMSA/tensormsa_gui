import React from 'react'
import SpinnerComponent from './../NNLayout/common/SpinnerComponent'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

export default class NN_InfoListTableComponent extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        function onAfterDeleteRow(rowKeys) {
            console.log(typeof deleteCommonNNInfo);
            //alert('The rowkey you drop: ' + rowKeys);
            this.deleteCommonNNInfo(rowKeys);
        }

        function onSelectRow(row) {
            //alert(`You click row id: ${row.key}`);
            console.log(row)
            console.log("row정보 : " + row.nn_id)
            console.log("row정보 : " + row.biz_cate)
            console.log("row정보 : " + row.biz_sub_cate)
            // this.thisClass.props.setActiveItem(row.nn_id,
            //                                    row.biz_cate,
            //                                    row.biz_sub_cate);
        }

        const selectRowProp = {
            mode: 'radio',
            clickToSelect: true,
            onSelect: onSelectRow,
            thisClass : this
        }

        const options = {
            paginationShowsTotal: true,
            sizePerPageList: [ 10, 15, 20, 50, 100 ],
            sizePerPage: 10
        }

        if( this.props.TableData != null){
            console.log("Table Search>>>>>>>>>>>>>>>>>>>>>")
            return (
                <div className="tblTableArea">
                    <table className="form-table align-left">
                        <BootstrapTable ref= 'table' data={this.props.TableData} options={ options } 
                            striped={true}
                            hover={true}
                            condensed={true}
                            pagination
                            selectRow={selectRowProp}
                            multiColumnSort={ 3 }>
                            <TableHeaderColumn dataField="nn_id" dataSort={ true } headerAlign='center' dataAlign='center' width="20" isKey={true} >ID</TableHeaderColumn>
                            <TableHeaderColumn dataField="biz_cate" dataSort={ true } headerAlign='center' dataAlign='center' width="10">Category</TableHeaderColumn>
                            <TableHeaderColumn dataField="biz_sub_cate" dataSort={ true } headerAlign='center' dataAlign='center' width="70">Type</TableHeaderColumn>
                        </BootstrapTable>
                    </table>
                </div>
            )
        }else{
            return (
                null
            )
        }
    }
}



