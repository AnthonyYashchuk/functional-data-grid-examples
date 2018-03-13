// @flow

import React, { Component } from 'react'
import './App.css'
import FunctionalDataGrid, { BaseColumn, Group, Sort, filterRenderers, utils} from 'functional-data-grid'
import { List } from 'immutable'
import shows from './resources/shows.json'
import moment from 'moment'

const AggregatesCalculators = utils.AggregatesCalculators
const DatePickerFilter = filterRenderers.DatePickerFilter

class App extends Component {

  render = () => <FunctionalDataGrid
                   columns={this.getColumns()}
                   data={this.getData()}
                   initialSort={List([ new Sort('name', 'asc'), new Sort('premiered', 'asc') ])}
                   initialFilter={List()}
                   groups={this.getGroups()}
                   style={{ grid: { height: '100%' }, group: { color: '#333', fontWeight: 'bold' }}}
                   aggregatesCalculator={this.getAggregatesCalculator()}
                 />

  getColumns = () => List([
    new BaseColumn({
      id : 'id',
      title: 'Id',
      hidden: true,
      valueGetter : (e) => e.id,
      filterable : false,
      sortable : true,
      width: 20,
      locked: true
    }),
    new BaseColumn({
      id : 'name',
      title: 'Name',
      valueGetter : (e) => e.name,
      filterable : true,
      sortable : true,
      resizable : true,
      width: 200,
      locked: true
    }),
    new BaseColumn({
      id : 'type',
      title: 'Type',
      valueGetter : (e: Object) => e.type,
      filterable : true,
      sortable : true,
      resizable : true,
      locked: true,
      renderer : (v : string) => <div style={{textAlign: 'center'}}>{ v }</div>
    }),
    new BaseColumn({
      id : 'status',
      title: 'Status',
      valueGetter : (e: Object) => e.status,
      filterable : true,
      sortable : true,
      resizable : true,
      renderer : (v : string) => <div style={{ color : v === 'Ended' ? '#F44336' : '#4CAF50', textAlign: 'center' }}>{ v }</div>,
      locked : true
    }),
    new BaseColumn({
      id : 'language',
      title: 'Language',
      valueGetter : (e) => e.language,
      filterable : true,
      sortable : true,
      resizable : true,
      renderer : (v : string) => <div style={{textAlign: 'center'}}>{ v }</div>
    }),
    new BaseColumn({
      id : 'premiered',
      title: 'Premiered',
      valueGetter : (e) => moment(e.premiered),
      filterable : true,
      sortable : true,
      resizable : true,
      renderer : (v) => <div style={{textAlign: 'center'}}>{ v.format('D MMMM YYYY') }</div>,
      filterRenderer : (onUpdateFilter: Function) => <DatePickerFilter dateFormat={"YYYY/MM/DD"} onUpdateFilter={onUpdateFilter} />,
      width: 150
    }),
    new BaseColumn({
      id : 'url',
      title: 'Url',
      valueGetter : (e) => e.url,
      renderer : (v) => <a href={ v } target={"blank"}>{ v }</a>,
      filterable : true,
      sortable : true,
      resizable : true,
      width: 350
    }),
    new BaseColumn({
      id : 'count',
      title: 'Count',
      aggregateValueGetter: (e: Object) => e.count,
      renderer : (v) => <div style={{textAlign: 'center'}}><b>{v}</b></div>,
      resizable : true,
      width: 350
    })
  ])

  getGroups = () => List([
    new Group({
      id: 'status',
      title: 'Status',
      groupingFunction: (e: Object) => e.status,
      comparator: (a: K, b: K) => a === b ? 0 : (a: any) < (b: any) ? 1 : -1
    }),
    new Group({
      id: 'type',
      title: 'Type',
      groupingFunction: (e: Object) => e.type
    })
  ])

  getAggregatesCalculator = () => (elements: List<Object>) => {
    return {
      count: AggregatesCalculators.count(elements)
    }
  }

  getData = () => List(shows.concat(...shows).concat(...shows))
}


export default App
