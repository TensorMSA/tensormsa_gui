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
            NN_Labels:[],
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

      let data = []
    
      for(let rows in bygen){
        let subData = {}
        let row = bygen[rows]
        let avg = 0
        for(let col in row){
          subData['name'] = 'Gen'+(rows*1+1)
          subData[row[col]['nn_wf_ver_id']+''] = (row[col]['acc']*100).toFixed(2)*1
          avg = avg + (row[col]['acc']*100).toFixed(2)*1
          subData['s'+row[col]['nn_wf_ver_id']] = row[col]['survive']

          if(this.state.NN_Labels.indexOf(row[col]['nn_wf_ver_id']) == -1){
            this.state.NN_Labels.push(row[col]['nn_wf_ver_id'])
          }
        }

        subData['avg'] = (avg/row.length).toFixed(2)*1
        data.push(subData)

      }
      this.state.NN_Labels = this.state.NN_Labels.sort()
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

        let lineChart = [];
        for(let i in this.state.NN_Labels){
          lineChart.push(    <Bar key={k++} dataKey={this.state.NN_Labels[i]} barSize={20} fill={getRandomColor()}/>)
        }
        lineChart.push(    <Line key={k++}  dataKey='avg' type='monotone' stroke='#ff7300'/>)

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

