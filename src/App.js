// @flow

import React, { Component } from 'react'
import './App.css'
import FunctionalDataGrid, { Column, Group, Sort, filterRenderers, utils, ColumnGroup} from 'functional-data-grid'
import shows from './resources/shows.json'

const AggregatesCalculators = utils.AggregatesCalculators
const SelectFilter = filterRenderers.SelectFilter

export default class App extends Component {

  render = () => <FunctionalDataGrid
                   columns={this.getColumns()}
                   columnGroups={this.getColumnGroups()}
                   data={this.getData()}
                   initialSort={[ new Sort('name', 'asc') ]}
                   initialFilter={[]}
                   groups={this.getGroups()}
                   style={{ grid: { height: '100%' }, row: (row: Object) => row.type === 'group-header' ? { color: '#333', fontWeight: 'bold' } : {}}}
                   aggregatesCalculator={this.getAggregatesCalculator()}
                   enableColumnsShowAndHide={true}
                   enableColumnsSorting={true}
                   rowHeight={(e, index, type) => type === 'element' ? 58 : 29}
                 />

  getLanguageChoices = () => this.getData().map(e => e.language).filter(this.unique).sort().map(e => [e, e])
  getTypeChoices = () => this.getData().map(e => e.type).filter(this.unique).sort().map(e => [e, e])
  getStatusChoices = () => this.getData().map(e => e.status).filter(this.unique).sort().map(e => [e, e])

  unique = (value, index, self) => self.indexOf(value) === index

  getColumnGroups = () => [
    new ColumnGroup({
      id: 'group1',
      title: 'Details'
    }),
    new ColumnGroup({
      id: 'group2',
      title: 'Extra details'
    }),
    new ColumnGroup({
      id: 'totals',
      title: 'Totals'
    })
  ]

  getColumns = () => [
    new Column({
      id : 'id',
      title: 'Id',
      hidden: true,
      valueGetter : (e) => e.id,
      filterable : false,
      sortable : true,
      width: 20,
      locked: true
    }),
    new Column({
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
    new Column({
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
    new Column({
      id : 'type',
      title: 'Type',
      valueGetter : (e: Object) => e.type,
      filterable : true,
      sortable : true,
      resizable : true,
      renderer : (v : string) => <div style={{textAlign: 'center'}}>{ v }</div>,
      filterRenderer : (onUpdateFilter: Function) => <SelectFilter choices={this.getTypeChoices()} onUpdateFilter={onUpdateFilter} />,
      columnGroup: 'group1'
    }),
    new Column({
      id : 'status',
      title: 'Status',
      valueGetter : (e: Object) => e.status,
      filterable : true,
      sortable : true,
      resizable : true,
      renderer : (v : string) => <div style={{ color : v === 'Ended' ? '#F44336' : '#4CAF50', textAlign: 'center' }}>{ v }</div>,
      filterRenderer : (onUpdateFilter: Function) => <SelectFilter choices={this.getStatusChoices()} onUpdateFilter={onUpdateFilter} />,
      columnGroup: 'group1'
    }),
    new Column({
      id : 'language',
      title: 'Language',
      valueGetter : (e) => e.language,
      filterable : true,
      sortable : true,
      resizable : true,
      renderer : (v : string) => <div style={{textAlign: 'center'}}>{ v }</div>,
      filterRenderer : (onUpdateFilter: Function) => <SelectFilter choices={this.getLanguageChoices()} onUpdateFilter={onUpdateFilter} />,
      columnGroup: 'group2'
    }),
    new Column({
      id : 'summary',
      title: 'Summary',
      valueGetter : (e) => e.summary.replace(/<\/?[^>]+(>|$)/g, ""),
      renderer: v => <i>{ v }</i>,
      filterable : true,
      resizable : true,
      width: 800,
      columnGroup: 'group2'
    }),
    new Column({
      id : 'rating',
      title: 'Rating',
      aggregateValueGetter: (e: Object) => e.rating,
      valueGetter: (e: Object) => e.rating.average,
      renderer : (v) => v != null && <div style={{textAlign: 'center', color: this.getRatingColor(v)}}>{Math.round(v * 10) / 10}</div>,
      resizable : true,
      sortable: true,
      locked: true,
      width: 80,
      columnGroup: 'totals'
    }),
    new Column({
      id : 'count',
      title: 'Count',
      valueGetter: (e: Object) => '',
      aggregateValueGetter: (e: Object) => e.count,
      renderer : (v) => <div style={{textAlign: 'center'}}><b>{v}</b></div>,
      resizable : true,
      locked: true,
      width: 80,
      columnGroup: 'totals'
    })
  ]

  getGroups = () => [
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
  ]

  getAggregatesCalculator = () => (elements: Array<Object>) => {
    return {
      count: AggregatesCalculators.count(elements),
      rating: elements.filter(e => e.rating.average != null).size === 0 ? null : AggregatesCalculators.average(elements.filter(e => e.rating.average != null).map(e => e.rating.average))
    }
  }

  getData = () => shows

  getRatingColor = (rating) => rating >= 6 ? '#4caf50' : '#F44336'
}
