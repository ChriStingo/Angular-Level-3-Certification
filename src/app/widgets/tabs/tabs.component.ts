import {AfterContentChecked, AfterContentInit, AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ContentChildren, EventEmitter, inject, Output, QueryList, Signal, ViewChildren} from '@angular/core';
import { TabPageComponent } from '../tab-page/tab-page.component';
import { TabHeader } from './tabs.types';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css']
})
export class TabsComponent implements AfterContentChecked {
  @ContentChildren(TabPageComponent) tabs: QueryList<TabPageComponent>;
  @Output() onDeleteTabById = new EventEmitter<string>();
  tabsHeader: TabHeader[] = [];

  ngAfterContentChecked(): void {
    /**
     * Behavior:
     * If there are changes in the tabs:
     * - Understand if there are new tabs or deleted ones
     *   - If there are new tabs, set the last one as active
     *   - If there are deleted tabs and there is a current active tab, leave it.
     *   - If there are deleted tabs and there isn't a current active tab, set the last one as active
     */
    if(this.tabs.length !== this.tabsHeader.length) {
      const thereAreNewTabs = this.tabs.length > this.tabsHeader.length;
      this.tabsHeader = this.tabs.map(tab => {return {title: tab.title, active: false, id: tab.id}});
      
      // Check if there are tabs or if all tabs were deleted
      if(this.tabsHeader.length) {
        if(thereAreNewTabs){
          this.changeActiveTab(this.tabsHeader[this.tabsHeader.length - 1]?.id);
        } else {
          this.changeActiveTab(this.tabs.find(tab => tab.active())?.id ?? this.tabsHeader[this.tabsHeader.length - 1]?.id)
        } 
      }
    }
  }

  // It's possible to use this method to change the active tab from the parent component, however, it's not necessary for the purpose of this exercise
  changeActiveTab(id: string) {
    // Change the active tab header
    this.tabsHeader.forEach(tab => tab.active = false);
    this.tabsHeader.find((tabHeader) => tabHeader.id === id).active = true;

    // Show the active tab content
    this.tabs.forEach(tab => tab.hideMe());
    this.tabs.find((tab) => tab.id === id)?.showMe();
  }

  onDeletedTab(id: string) {
    this.onDeleteTabById.emit(id);
  }
}
