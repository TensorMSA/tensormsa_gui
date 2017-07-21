import React from 'react';
import Api from './../utils/Api'
import Modal from 'react-modal';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

import ReportRepository from './../repositories/ReportRepository'


export default class NN_InfoNewComponent extends React.Component {
    constructor(props, context) {
        super(props);
        this.state = {
            tableData: null,
            NN_TableMaster: null,
            NN_TableData: null,
            NN_TableDataDetail : null,
            selModalView: null,
            nn_id : null,
            wf_ver_id : null,
            stepBack : 1,
            stepForward : 2
        };
    }

    // 최초 1회 실행하여 Network Config List를 가져온다.
    componentDidMount(){
        this.getCommonNNInfoAuto('all');
    }

    // get Network List ex)wdnn, resnet, charcnn_csv    
    getCommonNNInfoAuto(params) {
        this.props.reportRepository.getCommonNNInfoAuto(params).then((tableData) => {
            this.setState({ NN_TableData: tableData })
        });   
    }

    // get Network config list ex)netconf_node, dataconf_node
    getCommonNNInfoAutoDetail(row){
        this.props.reportRepository.getCommonNNInfoAuto(row.id).then((tableData) => {
            this.setState({ NN_TableDataDetail: tableData })
        });
    }

    getConfigData(){
        let tdata = this.refs.tbody.rows

        let preData = []
        let params = {}
        let maxrowcnt = this.refs.master3.tHead.children[0].childElementCount
        let arr = []
        for(let rowcnt=0;rowcnt < tdata.length;rowcnt++){
            let j = 0
            let row = tdata[rowcnt].cells

            // Select Box의 선택 값을 가져와 넣어준다.
            for(let colcnt=0;colcnt < maxrowcnt;colcnt++){
                if(preData[colcnt] == undefined){
                    preData[colcnt] = {textContent:row[colcnt].textContent.trim(),rowSpan:row[colcnt].rowSpan,contentEditable:row[colcnt].contentEditable}
                }else{
                    if(preData[colcnt].rowSpan == 1){
                        if(row[j].childNodes[0] != undefined && row[j].childNodes[0].childNodes[0] != undefined){
                            if(row[j].childNodes[0].childNodes[0].type == "select-one"){
                                let selectedValue = row[j].childNodes[0].childNodes[0].selectedOptions[0].value
                                preData[colcnt] = {textContent:selectedValue.trim(),rowSpan:row[j].rowSpan,contentEditable:"true"}
                            }
                        }else{
                            preData[colcnt] = {textContent:row[j].textContent.trim(),rowSpan:row[j].rowSpan,contentEditable:row[j].contentEditable}
                        }
                        
                        j += 1
                    }else if(preData[colcnt].rowSpan > 1){
                        preData[colcnt].rowSpan = preData[colcnt].rowSpan-1
                    }
                }
            }
                      
            let value = ""
            let param = params
            for(let k=0;k < preData.length-1;k++){  
                let inputflag = preData[k].contentEditable
                let textdata = preData[k].textContent
                if(textdata == ""){ // 데이터가 끝까지 없는 경우는 넘어가야 한다.
                    continue
                }
                // Value 값을 가져오기 위함이다.
                let vflag = preData[k+1].contentEditable
                let vdata = preData[k+1].textContent

                if(vflag == "true"){
                    param[textdata] = vdata
                }else if(vflag = "inherit" && isNaN(vdata) == false ){//자식이 컬럼이면서 숫자인 경우는 배열이다. 
                    if(param[textdata] == undefined && inputflag == "inherit"){// 값이 없의 면서 Json
                        param[textdata] = []
                    }
                    param = param[textdata]
                }else{//배열이 아닌 경우
                    if(param[textdata] == undefined && inputflag == "inherit"){// 값이 없의 면서 Json
                        param[textdata] = {}
                    }
                    param = param[textdata]
                }
            }
        }
        return params
    }

    // Network Create
    saveCommonNNInfoNew() {
        let flag = "T"
        let title = ""
        let input_data = ""
        
        // Validation
        for (var i in this.refs.master1.state.data) {
            title = this.refs.master1.state.data[i]["title"]
            input_data = this.refs.master1.state.data[i]["input_data"]
            if(input_data == null || input_data == ""){ alert( title + " is not exist." );return; flag = "F"; break;}
        }

        let netType = this.refs.master2.state.selectedRowKeys
        if(flag == "T" && (netType == null || netType == "")){ 
            alert( "Select a Network Type") 
            return
        }
        netType = netType[0]

        let params = this.getConfigData()
        
        // Make NN Info
        let inDefault = ["biz_cate","biz_sub_cate","nn_title","nn_desc"]
        let dparam = {}
        for (let i in this.refs.master1.state.data) {
            title = this.refs.master1.state.data[i]["title"]
            input_data = this.refs.master1.state.data[i]["input_data"]
            dparam[inDefault[i]] = input_data
        }
        dparam["use_flag"] = "Y"
        dparam["config"] = "N"
        dparam["automl_parms"] = params

        // Make NN WF Info
        let wfparam = {}
        wfparam["nn_def_list_info_nn_id"] = ""
        wfparam["nn_wf_ver_info"] = "init"
        wfparam["condition"] = "1"
        wfparam["active_flag"] = "Y"

        // Make NN WF Node Info
        let nodeparam = {}
        nodeparam["type"] = netType

        // let nn_id = "nn00000025"
        // let wf_ver_id = "1"

        // Make NN Info
        this.props.reportRepository.postCommonNNInfo("", dparam).then((nn_id) => {
            // Make NN WF Info
            this.props.reportRepository.postCommonNNInfoWF(nn_id, wfparam).then((wf_ver_id) => {
                // Make NN WF Node Info
                this.props.reportRepository.postCommonNNInfoWFNode(nn_id, wf_ver_id, nodeparam).then((tableData) => {
                });
            });
        });
                
    }

    handleChange(selectedValue){
        console.log(selectedValue.target.value)

    }

    render() {
        /////////////////////////////////////////////////////////////////////////////////////////
        // First Network Default
        /////////////////////////////////////////////////////////////////////////////////////////
        const cellEditProp = {
            mode: 'click',
            blurToSave: true
        }

        // Network default
        let nnInfoDefault = [];
        if (this.state.NN_TableMaster == null){
            this.state.NN_TableMaster = [   {title:"Category"          , input_data:"", ex:"ex) ERP, MES, SCM"}
                                            ,{title:"SubCategory"      , input_data:"", ex:"ex) MRO"}
                                            ,{title:"Title"         , input_data:"", ex:"ex) MRO Classification"}
                                            ,{title:"Description"   , input_data:"", ex:"ex) MRO Classification Description"}
                                         ];
        }
        nnInfoDefault = this.state.NN_TableMaster
        /////////////////////////////////////////////////////////////////////////////////////////
        // Second Network List
        /////////////////////////////////////////////////////////////////////////////////////////
        const options = {
            defaultSortName: 'id',
            defaultSortOrder: 'asc'
        }

        const selectRowProp = {
            mode: 'radio',
            clickToSelect: true,
            onSelect: onSelectRow,
            thisClass : this
        }

        function onSelectRow(row) {
            this.thisClass.getCommonNNInfoAutoDetail(row);
        }

        // Network List
        let nnInfoNewList = [];
        if (this.state.NN_TableData != null) {
            for (var i in this.state.NN_TableData) {
                nnInfoNewList[i] = {id:this.state.NN_TableData[i]["pk"], desc:this.state.NN_TableData[i]["fields"]["graph_flow_desc"]};
            }
        }
        /////////////////////////////////////////////////////////////////////////////////////////
        // Third Network Config List
        /////////////////////////////////////////////////////////////////////////////////////////
        //테이블에 출력시 정렬을 위해 사용한다.
        function jsonKeySort(data){
            let keys = null
            if(data != null && typeof(data) != "string"){
                keys = Object.keys(data)
                keys.sort()
            }
            
            return keys
        }

        // Json 을 기준으로 빈 노드를 계층구조로 만들어 준다.
        function setNode(ppNode){
            let recnt = 0
            let pNode = null
            let data = ppNode.data
            ppNode.flag = "Y"
            if(ppNode.child == null){
                let keyArray1 = jsonKeySort(data)//data를 기준으로 자식을 찾아 소팅해준다.
                for(let key1 in keyArray1){
                    const node ={
                        key : keyArray1[key1],
                        prev : null,
                        next : null,
                        child : null,
                        flag : "N",
                        dataflag : "N",
                        childcnt :0,
                        depth:1,
                        rspancnt:0,
                        parents:ppNode,
                        data : data[keyArray1[key1]]
                    }
                    
                    if(key1 == 0){
                        pNode = node
                        ppNode.child = pNode    
                    }else{
                        node.prev = pNode
                        pNode.next = node
                        pNode = node
                    } 
                }
                
                if(keyArray1 != null){
                    recnt = keyArray1.length
                } 
            } 
            
            return recnt
        }

        // 만들어진 노드에 Data를 넣어준다. 노드를 만들고 나서 데이터를 조정해야 해서 분리함.
        function setDataNode(node){
            let data = {}
            let tmpnode = node
            for(let i=node.depth;i > 0 ;i--){
                let key1 = "col"+i
                if(i == node.depth){
                    data[key1] = tmpnode.data 
               }else{
                    data[key1] = tmpnode.key
                    if(tmpnode.parents != null){
                        tmpnode = tmpnode.parents
                    }
               }
            }

            let redata = {}
            let keysort = Object.keys(data)
            keysort.sort()
            for(let key2 of keysort){
                redata[key2] = data[key2]
            }

            // child cnt
            node.childcnt = 1
            while(true){ 
                if(node.parents == null){
                    break
                }
                node = node.parents
                node.childcnt += 1
            }

            return redata
        }

        // 테이블 구릅핑에 필요한 수를 넣어준다.
        function getRspanCount(rspantext, node){
            // console.log(rspantext)
            let childcnt = 0
            let rspancnt = 0
            let outcnt = 0
            for (let cnt in rspantext){
                if(node.child != null){
                    node = node.child
                }
                while(true){
                    if(node.key == rspantext[cnt]){
                        break
                    }else{
                        node = node.next
                    }
                }
                childcnt = node.childcnt
                rspancnt = node.rspancnt

                if(cnt == rspantext.length - 1){
                    if(childcnt == rspancnt && rspancnt > 0){
                        node.rspancnt = 0
                        childcnt = 0
                    }else if(childcnt > rspancnt && rspancnt > 0){
                        node.rspancnt = node.rspancnt + 1
                        childcnt = 0
                    }else{
                        node.rspancnt = node.rspancnt + 1
                    }
                }       
            }
            
            return childcnt
        }

        // 노드를 만들어 주는 기능을 한다.
        function makeNode(data){
            const rNode ={
                key :"root",
                prev : null,
                next : null,
                child : null,
                flag : "N",
                dataflag : "Y",
                childcnt :0,
                rspancnt:0,
                parents:null,
                data : null,
                colcnt :0,
                depth:1
            }
            
            // Key Make Array
            let checkcnt = 0
            if (data != null) {
                for (let i in data) {
                    rNode.data = data[i]
                    checkcnt = setNode(rNode)
                }
            }
            
            let node = rNode
            let colcnt = 0
            let outcnt = 0
            while(true){
                if(node.child != null && node.child.flag == "N"){
                    colcnt += 1
                    node.depth = colcnt
                    if(rNode.colcnt < node.depth){
                        rNode.colcnt = node.depth
                    }
                    node = node.child
                }else if(node.next != null){
                    node.depth = colcnt + 1
                    if(rNode.colcnt < node.depth){
                        rNode.colcnt = node.depth
                    }
                    node = node.next  
                }else if(node.child == null && node.next == null && node.parents != null){
                    node.depth = colcnt + 1
                    if(rNode.colcnt < node.depth){
                        rNode.colcnt = node.depth
                    }
                    colcnt -= 1
                    node = node.parents
                }else if(node.child != null && node.child.flag == "Y" && node.parents != null){
                    colcnt -= 1
                    node = node.parents
                }

                checkcnt = setNode(node)
                if(node.parents == null){
                    break
                }
                
                outcnt += 1
                if(outcnt>3000){
                    break
                }
            }
            return rNode
        }

        function makeNodeData(node){
            // Data Make Array
            let outcnt = 0
            let k = 1
            let nnInfoNewListDetail = []
            while(true){
                if(node.child != null && typeof(node.data) == "object" && node.data.length != undefined && node.dataflag == "N"){
                    node.dataflag = "Y"
                    if(node.key == "option"){
                        node.child.dataflag = "Y"
                    }
                }else if(node.child != null && node.child.dataflag == "N"){
                    node.dataflag = "Y"
                    node = node.child  
                }else if(node.child == null && node.depth != 1 && node.dataflag == "N") {
                    if(node.key != "option"){
                        let data = setDataNode(node)
                        nnInfoNewListDetail[k++] = data
                    }
                    node.dataflag = "Y"
                }else if(node.next != null){
                    node = node.next
                }else if(node.child == null && node.next == null && node.parents != null){
                    node = node.parents
                }else if(node.child != null && node.child.dataflag == "Y" && node.parents != null){
                    node = node.parents
                }

                if(node.parents == null){
                    break
                }

                outcnt += 1
                if(outcnt>3000){
                    break
                }
            }
            return nnInfoNewListDetail
        }

        // Network List Detail
        let rNode = makeNode(this.state.NN_TableDataDetail)
        let nnInfoNewListDetail = makeNodeData(rNode)

        console.log(rNode)
        console.log(nnInfoNewListDetail)

        /////////////////////////////////////////////////////////////////////////////////////////
        // NetConf Table Header Make
        /////////////////////////////////////////////////////////////////////////////////////////
        let k = 1
        let tableHeader = []; //make header
        let colDatas = ["col1", "col2", "col3", "col4", "col5", "col6", "col7"]
        if(rNode.colcnt > 0){
            colDatas = []
            for(let i=0;i < rNode.colcnt ; i++){
                colDatas.push("col"+(i+1))
            }
        }
        let headerData = []
        for (let i=0;i < colDatas.length;i++){
            headerData.push(<th key={k++} style={{"text-align":"center"}} >{colDatas[i]}</th>)
        }
        
        tableHeader.push(<tr key={k++} >{headerData}</tr>)

        /////////////////////////////////////////////////////////////////////////////////////////
        // NetConf Table Data Make
        /////////////////////////////////////////////////////////////////////////////////////////
        let tableData = []; // make tabledata
        for(let rows in nnInfoNewListDetail){
            let colData = [];
            let lastColcnt = 0;
            
            for(let cols in nnInfoNewListDetail[rows]){
                if(nnInfoNewListDetail[rows][cols] === null || nnInfoNewListDetail[rows][cols] === ""){
                    break;
                }else if(nnInfoNewListDetail[rows][cols] === "sel"){
                    lastColcnt += 1
                    break;
                } else{
                    lastColcnt += 1
                }
            }

            let colcnt = 1

            let rspantext = []

            for(let cols in nnInfoNewListDetail[rows]){
                let rspancnt = 0
                let option = []
                let inputdata = nnInfoNewListDetail[rows][cols]

                if(colcnt === lastColcnt){       
                    if(typeof(inputdata) == "object"){
                        inputdata = "{ }"
                        colData.push(<td key={k++} contentEditable={"true"} style={{"color":"red"}} rowSpan={1}> {inputdata}</td>) 
                    }else if(inputdata === false){
                        inputdata = "false"
                        colData.push(<td key={k++} contentEditable={"true"} style={{"color":"red"}} rowSpan={1}> {inputdata}</td>)
                    }else if(inputdata === "sel"){
                        let opArray = this.state.NN_TableDataDetail[0]
                        for(let op=0;op < lastColcnt-2;op++){
                            opArray = opArray[nnInfoNewListDetail[rows][colDatas[op]]]
                        }
                        opArray =opArray["option"]
                        for(let op=0;op < opArray.length;op++){
                            option.push(<option key={k++} value={opArray[op]}>{opArray[op]}</option>)
                        }
                        colData.push( <td key={k++}>
                                        <div>
                                        <select ref={"sel"+k} onChange={this.handleChange.bind(this)}
                                               id={k} 
                                               defaultValue={opArray[0]}
                                               style={{"color":"red"}}
                                               rowSpan={1}>
                                           {option}
                                        </select>
                                        </div>
                                    </td>)
                    }else{
                        colData.push(<td key={k++} contentEditable={"true"} style={{"color":"red"}} rowSpan={1}> {inputdata}</td>)
                    }
                }else{
                    rspantext.push(inputdata)
                    rspancnt = getRspanCount(rspantext, rNode)
                    // rspancnt = 1
                    if(rspancnt > 0){
                        colData.push(<td key={k++} rowSpan= {rspancnt}> {inputdata} </td>) 
                    }   
                }
                colcnt += 1
            }

            //add column
            for(let i=0;i<colDatas.length-lastColcnt;i++){
                colData.push(<td key={k++} ></td>) 
            }

            tableData.push(<tr key={k++}>{colData}</tr>)
        }
        

        // console.log(tableData)

        let nnInfoNewListDetailTable = []
        nnInfoNewListDetailTable.push(<thead ref='thead' key={k++} className="center">{tableHeader}</thead>)
        nnInfoNewListDetailTable.push(<tbody ref='tbody' key={k++} className="center" >{tableData}</tbody>)


        return (
            <section>
                <h1 className="hidden">tensor MSA main table</h1>
                <div className="container paddingT10">
                    <div className="tblBtnArea">
                        <button type="button" className="save" onClick={() => this.saveCommonNNInfoNew()} >Save</button>
                    </div>

                    <div className="net-info-default">
                        <table className="form-table align-left">
                            <BootstrapTable ref= 'master1' 
                                data={nnInfoDefault} 
                                striped={true} 
                                hover={true} 
                                condensed={true} 
                                cellEdit={ cellEditProp } 
                                >
                                
                                <TableHeaderColumn dataField="title" headerAlign='center' dataAlign='center' isKey={true} >Title</TableHeaderColumn>
                                <TableHeaderColumn dataField="input_data"  headerAlign='center' dataAlign='center' >Input Data</TableHeaderColumn>
                                <TableHeaderColumn dataField="ex"  headerAlign='center' dataAlign='left' editable={ false } >Example</TableHeaderColumn>
                            </BootstrapTable>
                        </table>
                    </div>

                    <div className="net-info">
                        <table className="form-table align-left">
                            <BootstrapTable ref= 'master2' 
                                data={nnInfoNewList} 
                                striped={true} 
                                hover={true} s
                                condensed={true} 
                                selectRow={selectRowProp}
                                options={ options } 
                                >
                                
                                <TableHeaderColumn dataField="id" headerAlign='center' dataAlign='center' isKey={true} >Network</TableHeaderColumn>
                                <TableHeaderColumn dataField="desc"  headerAlign='center' dataAlign='center' >Description</TableHeaderColumn>
                               
                            </BootstrapTable>
                        </table>
                    </div>


                    <div>
                        <table className="table detail" ref= 'master3' >
                            {nnInfoNewListDetailTable}
                        </table>
                    </div>
               


                    
                </div>
            </section>

        );
    }
}

NN_InfoNewComponent.defaultProps = {
    reportRepository: new ReportRepository(new Api())
};

