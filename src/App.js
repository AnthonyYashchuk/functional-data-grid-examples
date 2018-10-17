// @flow

import React, { Component } from 'react'
import './App.css'
import FunctionalDataGrid, { BaseColumn, Group, Sort, filterRenderers, utils} from 'functional-data-grid'
import { List } from 'immutable'
import shows from './resources/shows.json'
import moment from 'moment'

const AggregatesCalculators = utils.AggregatesCalculators
const SelectFilter = filterRenderers.SelectFilter
const DatePickerFilter = filterRenderers.DatePickerFilter

export default class App extends Component {

  render = () => <FunctionalDataGrid
                   columns={this.getColumns()}
                   data={this.getData()}
                   initialSort={List([ new Sort('name', 'asc'), new Sort('premiered', 'asc') ])}
                   initialFilter={List()}
                   groups={this.getGroups()}
                   style={{ grid: { height: '100%' }, group: { color: '#333', fontWeight: 'bold' }}}
                   aggregatesCalculator={this.getAggregatesCalculator()}
                   enableColumnsShowAndHide={true}
                   enableColumnsSorting={true}
                   rowHeight={(e, index, type) => type === 'element' ? 58 : 29}
                 />

  getLanguageChoices = () => this.getData().map(e => e.language).toSet().toList().sort().map(e => [e, e])
  getTypeChoices = () => this.getData().map(e => e.type).toSet().toList().sort().map(e => [e, e])
  getStatusChoices = () => this.getData().map(e => e.status).toSet().toList().sort().map(e => [e, e])

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
      id : 'image',
      title: 'Image',
      valueGetter : (e) => e.image.medium,
      renderer: (v: string) => <img src={v} alt="" style={{ maxHeight: '50px', verticalAlign: 'middle' }} />,
      filterable : false,
      sortable : false,
      resizable : true,
      width: 60,
      locked: true
    }),
    new BaseColumn({
      id : 'name',
      title: 'Name',
      valueGetter : (e) => e.name,
      renderer : (v, e) => <a href={ e.url } target={"blank"}>{ v }</a>,
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
      renderer : (v : string) => <div style={{textAlign: 'center'}}>{ v }</div>,
      filterRenderer : (onUpdateFilter: Function) => <SelectFilter choices={this.getTypeChoices()} onUpdateFilter={onUpdateFilter} />,
    }),
    new BaseColumn({
      id : 'status',
      title: 'Status',
      valueGetter : (e: Object) => e.status,
      filterable : true,
      sortable : true,
      resizable : true,
      renderer : (v : string) => <div style={{ color : v === 'Ended' ? '#F44336' : '#4CAF50', textAlign: 'center' }}>{ v }</div>,
      filterRenderer : (onUpdateFilter: Function) => <SelectFilter choices={this.getStatusChoices()} onUpdateFilter={onUpdateFilter} />
    }),
    new BaseColumn({
      id : 'language',
      title: 'Language',
      valueGetter : (e) => e.language,
      filterable : true,
      sortable : true,
      resizable : true,
      renderer : (v : string) => <div style={{textAlign: 'center'}}>{ v }</div>,
      filterRenderer : (onUpdateFilter: Function) => <SelectFilter choices={this.getLanguageChoices()} onUpdateFilter={onUpdateFilter} />,
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
      id : 'summary',
      title: 'Summary',
      valueGetter : (e) => e.summary.replace(/<\/?[^>]+(>|$)/g, ""),
      renderer: v => <i>{ v }</i>,
      filterable : true,
      resizable : true,
      width: 800
    }),
    new BaseColumn({
      id : 'rating',
      title: 'Rating',
      aggregateValueGetter: (e: Object) => e.rating,
      valueGetter: (e: Object) => e.rating.average,
      renderer : (v) => v != null && <div style={{textAlign: 'center', color: this.getRatingColor(v)}}>{Math.round(v * 10) / 10}</div>,
      resizable : true,
      sortable: true,
      locked: true,
      width: 80
    }),
    new BaseColumn({
      id : 'count',
      title: 'Count',
      valueGetter: (e: Object) => '',
      aggregateValueGetter: (e: Object) => e.count,
      renderer : (v) => <div style={{textAlign: 'center'}}><b>{v}</b></div>,
      resizable : true,
      locked: true,
      width: 80
    })
  ])

  getGroups = () => List([
    new Group({
      id: 'status',
      title: 'Status',
      groupingFunction: (e: Object) => e.status,
      comparator: (a: any, b: any) => (a === b) ? 0 : ((a: any) < (b: any)) ? 1 : -1
    }),
    new Group({
      id: 'type',
      title: 'Type',
      groupingFunction: (e: Object) => e.type
    })
  ])

  getAggregatesCalculator = () => (elements: List<Object>) => {
    return {
      count: AggregatesCalculators.count(elements),
      rating: elements.filter(e => e.rating.average != null).size === 0 ? null : AggregatesCalculators.average(elements.filter(e => e.rating.average != null).map(e => e.rating.average))
    }
  }

  getData = () => List(shows)

  getRatingColor = (rating) => rating >= 6 ? '#4caf50' : '#F44336'
}
