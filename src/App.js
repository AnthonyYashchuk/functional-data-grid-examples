import React, { Component } from 'react';
import './App.css';
import FunctionalDataGrid, { BaseColumn, Group } from 'functional-data-grid'
import { List } from 'immutable'

class App extends Component {

  render = () => <FunctionalDataGrid
                   columns={this.getColumns()}
                   data={this.getData()}
                   initialSort={List()}
                   initialFilter={List()}
                   groups={List()}
                   additionalStyle={{height: '500px'}}
                 />

  getColumns = () => List([
    new BaseColumn({
      id : 'id',
      title: 'Id',
      valueGetter : (e) => e.id,
      filterable : false,
      sortable : true,
      width: 50
    }),
    new BaseColumn({
      id : 'name',
      title: 'Name',
      valueGetter : (e) => e.name,
      filterable : true,
      sortable : true,
      resizable : true
    })
  ])

  getData = () => List([
    {
      id : 0,
      name : 'Pippo'
    },
    {
      id : 1,
      name : 'Pluto'
    },
    {
      id : 2,
      name : 'Topolino'
    },
    {
      id : 3,
      name : 'Paperino'
    }
  ])
}


export default App;
