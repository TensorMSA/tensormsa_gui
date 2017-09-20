import React from 'react'
import ReportRepository from './../repositories/ReportRepository'
import Api from './../utils/Api'

import {ComposedChart, Line, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer}  from 'recharts';

export default class NN_InfoDetailLine extends React.Component {
    constructor(props, context) {
        super(props);
        this.state = {
            NN_DataPre:null,
            NN_Data:null,
            NN_Labels:null,
            lineChartLabels:null,
            lineChartData:null,
            lineColor:["#ff8022","#ffcf3b","#47de8a","#999966","#33cccc","#ff66ff","#F85F73"] 
        };
    }
    /////////////////////////////////////////////////////////////////////////////////////////
    // Search Function
    /////////////////////////////////////////////////////////////////////////////////////////
    componentDidMount() {
      
    }
    /////////////////////////////////////////////////////////////////////////////////////////
    // Version Batch Bar Chart
    /////////////////////////////////////////////////////////////////////////////////////////   
    setLineChartData(lineData){

    }

    lineChartOnClick(value){//Chart의 세부 카테고리 정보를 보여준다.


    }


    render() {
        let k = 1
        /////////////////////////////////////////////////////////////////////////////////////////
        // Common Function
        /////////////////////////////////////////////////////////////////////////////////////////

        let lineData = this.props.NN_Data

        lineData = [
[{'survive': true, 'nn_wf_ver_id': 78, 'acc': 0.7435294117647059, 'flag': true, 'generation': 0, 'nn_id': 'auto_wcnn037'},
{'survive': true, 'nn_wf_ver_id': 76, 'acc': 0.5105882352941177, 'flag': true, 'generation': 0, 'nn_id': 'auto_wcnn037'},
{'survive': false, 'nn_wf_ver_id': 77, 'acc': 0.36470588235294116, 'flag': true, 'generation': 0, 'nn_id': 'auto_wcnn037'}],
[
{'survive': true, 'nn_wf_ver_id': 78, 'acc': 0.7435294117647059, 'flag': true, 'generation': 0, 'nn_id': 'auto_wcnn037'},
{'survive': false, 'nn_wf_ver_id': 76, 'acc': 0.5105882352941177, 'flag': true, 'generation': 0, 'nn_id': 'auto_wcnn037'},
{'survive': false, 'nn_wf_ver_id': 77, 'acc': 0.36470588235294116, 'flag': true, 'generation': 0, 'nn_id': 'auto_wcnn037'}],
[
{'survive': true, 'nn_wf_ver_id': 78, 'acc': 0.7435294117647059, 'flag': true, 'generation': 0, 'nn_id': 'auto_wcnn037'},
{'survive': true, 'nn_wf_ver_id': 79, 'acc': 0.6188235294117647, 'flag': true, 'generation': 1, 'nn_id': 'auto_wcnn037'},
{'survive': false, 'nn_wf_ver_id': 76, 'acc': 0.5105882352941177, 'flag': true, 'generation': 0, 'nn_id': 'auto_wcnn037'}],
[
{'survive': true, 'nn_wf_ver_id': 78, 'acc': 0.7435294117647059, 'flag': true, 'generation': 0, 'nn_id': 'auto_wcnn037'},
{'survive': false, 'nn_wf_ver_id': 76, 'acc': 0.5105882352941177, 'flag': true, 'generation': 0, 'nn_id': 'auto_wcnn037'},
{'survive': false, 'nn_wf_ver_id': 77, 'acc': 0.36470588235294116, 'flag': true, 'generation': 0, 'nn_id': 'auto_wcnn037'}],
[
{'survive': true, 'nn_wf_ver_id': 78, 'acc': 0.7435294117647059, 'flag': true, 'generation': 0, 'nn_id': 'auto_wcnn037'},
{'survive': true, 'nn_wf_ver_id': 79, 'acc': 0.6188235294117647, 'flag': true, 'generation': 1, 'nn_id': 'auto_wcnn037'},
{'survive': false, 'nn_wf_ver_id': 76, 'acc': 0.5105882352941177, 'flag': true, 'generation': 0, 'nn_id': 'auto_wcnn037'}],
[
{'survive': true, 'nn_wf_ver_id': 78, 'acc': 0.7435294117647059, 'flag': true, 'generation': 0, 'nn_id': 'auto_wcnn037'},
{'survive': true, 'nn_wf_ver_id': 79, 'acc': 0.6188235294117647, 'flag': true, 'generation': 1, 'nn_id': 'auto_wcnn037'},
{'survive': false, 'nn_wf_ver_id': 80, 'acc': 0.5529411764705883, 'flag': true, 'generation': 2, 'nn_id': 'auto_wcnn037'}]
                      ]

        if(lineData != this.state.NN_DataPre){
          this.setLineChartData(lineData)
        }
        this.state.NN_DataPre = lineData

        const data = [{name: '1', uv: 590, pv: 800},
                      {name: '2', uv: 868, pv: 967, amt: 1506},
                      {name: '3', uv: 1397, pv: 1098, amt: 989},
                      {name: '4', uv: 1480, amt: 1228},
                      {name: '5', uv: 1320, pv: 1108, amt: 1000},
                      {name: '6', uv: 1420, pv: 1208, amt: 1100},
                      {name: '7', uv: 1520, pv: 1308, amt: 1200},
                      {name: '8', uv: 1620, pv: 1408, amt: 1400},
                      {name: '9', pv: 1508, amt: 1550},
                      {name: '10', uv: 1520, pv: 1608, amt: 1600},
                      {name: '11', uv: 1400, pv: 1680, amt: 1700}
                      ]

        let lineChart = [];
        lineChart.push(    <Bar key={k++} dataKey='pv' barSize={20} fill='#413ea0'/>)
        lineChart.push(    <Bar key={k++} dataKey='amt' barSize={20} fill='#8884d8'/>)
        lineChart.push(    <Line key={k++} type='monotone' dataKey='uv' stroke='#ff7300'/>)

        return (  

            <section>
            <div className="container paddingT10">

           
              <ResponsiveContainer key={k++} width='100%' height={200}>
                <ComposedChart key={k++} data={data} margin={{top: 20, right: 20, bottom: 20, left: 20}}>
                  <XAxis key={k++} dataKey="name"/>
                  <YAxis key={k++} />
                  <Tooltip key={k++} />
                  <Legend key={k++} />
                  <CartesianGrid key={k++} stroke='#f5f5f5'/>
                  {lineChart}
               </ComposedChart >
              </ResponsiveContainer >



               
            </div>
            </section>
        )
    }
}

