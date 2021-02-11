import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Column } from '@shared/type/column.type';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { EventEmitter } from 'events';

@Component({
  selector: 'app-dashboard-table',
  templateUrl: './dashboard-table.component.html',
  styleUrls: ['./dashboard-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardTableComponent<GenericModel> implements OnInit, OnDestroy {

  @ViewChild(MatSort) sort?: MatSort;
  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }

  columnNames: string[] = [];
  @Input() columns: Column<GenericModel>[] = [];
  @Input() pageSize = 0;
  @Input() pageSizeOptions: number[] = [];
  @Input() dataSource = new MatTableDataSource();

  @Output() onAction = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
    this.columnNames = this.columns.map((column) => column.name.toString());
  }

  ngOnDestroy(): void {
  }

  private setDataSourceAttributes(): void {
    this.dataSource.paginator = this.paginator ? this.paginator : null;
    this.dataSource.sort = this.sort ? this.sort : null;
  }
  syncPrimaryPaginator(event: PageEvent): void {
    if (this.paginator) {
      this.paginator.pageIndex = event.pageIndex;
      this.paginator.pageSize = event.pageSize;
    }
    this.paginator?.page.emit(event);
  }
}
