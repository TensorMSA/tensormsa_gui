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
            trueColor:"#14c0f2",
            falseColor:"#ff8022"
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
      let best = lineData['best']
      let bygen = lineData['bygen']


      bygen =
        {
          0:
{
        0:{'generation': 0, 'nn_wf_ver_id': 3, 'flag': 'True', 'nn_id': 'nn00000099', 'survive': 'True', 'acc': 0.4424}
      ,1:{'generation': 0, 'nn_wf_ver_id': 1, 'flag': 'True', 'nn_id': 'nn00000099', 'survive': 'True', 'acc': 0.2232323}
      ,2:{'generation': 0, 'nn_wf_ver_id': 2, 'flag': 'True', 'nn_id': 'nn00000099', 'survive': 'False', 'acc': 0.2453}
},1:{
      0:{'generation': 0, 'nn_wf_ver_id': 3, 'flag': 'True', 'nn_id': 'nn00000099', 'survive': 'True', 'acc': 0.45454324}
      ,1:{'generation': 0, 'nn_wf_ver_id': 1, 'flag': 'True', 'nn_id': 'nn00000099', 'survive': 'True', 'acc': 0.2232}
      ,2:{'generation': 0, 'nn_wf_ver_id': 4, 'flag': 'True', 'nn_id': 'nn00000099', 'survive': 'False', 'acc': 0.23435}
    }
    ,2:{
      0:{'generation': 0, 'nn_wf_ver_id': 5, 'flag': 'True', 'nn_id': 'nn00000099', 'survive': 'True', 'acc': 0.45454324}
      ,1:{'generation': 0, 'nn_wf_ver_id': 1, 'flag': 'True', 'nn_id': 'nn00000099', 'survive': 'True', 'acc': 0.2232}
      ,2:{'generation': 0, 'nn_wf_ver_id': 3, 'flag': 'True', 'nn_id': 'nn00000099', 'survive': 'False', 'acc': 0.23435}
    }
    }




      let data = []
    
      for(let rows in bygen){
        let subData = {}
        let row = bygen[rows]
        for(let col in row){
          subData['name'] = 'Gen'+(rows*1+1)
          subData[row[col]['nn_wf_ver_id']+''] = (row[col]['acc']*100).toFixed(2)*1
          subData['s'+row[col]['nn_wf_ver_id']] = row[col]['survive']
        }
        data.push(subData)

      }
      this.setState({ NN_Data: data })


    }

    lineChartOnClick(value){//Chart의 세부 카테고리 정보를 보여준다.
    }


    render() {
        let k = 1
        /////////////////////////////////////////////////////////////////////////////////////////
        // Common Function
        /////////////////////////////////////////////////////////////////////////////////////////
        function getRandomColor() {
          var letters = '0123456789ABCDEF';
          var color = '#';
          for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
          }
          return color;
        }

        let lineData = this.props.NN_Data

        if(lineData != null && this.state.NN_Data == null){
          this.setLineChartData(lineData)
        }



        // this.state.NN_Data = [{name: 'Gen1', '1': 590, '2': 800 , '3':900, avg: 710},
        //                       {name: 'Gen2', '1': 868, '2': 967, '3':1000, avg: 900},
        //                       {name: 'Gen3', '1': 1397, '2': 1098, '3':1000, avg: 1150}
        //                       ]

        let lineChart = [];
        for(let i in this.state.NN_Data){
          console.log(i)
        }
        
        lineChart.push(    <Bar key={k++} dataKey='1' barSize={20} fill='#413ea0'/>)
        lineChart.push(    <Bar key={k++} dataKey='2' barSize={20} fill='#8884d8'/>)
        lineChart.push(    <Line key={k++}  dataKey='3' type='monotone' stroke='#ff7300'/>)

        return (  

            <section>
            <div className="container paddingT10">

            <table ref="linechart_rechart" className="chart">
                        <tr>
                        <td>
              <ResponsiveContainer key={k++} width='100%' height={200}>
                <ComposedChart key={k++} data={this.state.NN_Data} margin={{top: 20, right: 20, bottom: 20, left: 20}}>
                  <XAxis key={k++} dataKey="name"/>
                  <YAxis key={k++} />
                  <Tooltip key={k++} />
                  <Legend key={k++} />
                  <CartesianGrid key={k++} stroke='#f5f5f5'/>
                  {lineChart}
               </ComposedChart >
              </ResponsiveContainer >
              </td>
              </tr>
              </table>


               
            </div>
            </section>
        )
    }
}

