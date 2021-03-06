import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SelectOption, SelectOptions } from '../select-option';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-favorite-ocean-creature-picker',
  styles: [':host { display: inline-block; }'],
  templateUrl: './favorite-ocean-creature-picker.component.html',
})
export class FavoriteOceanCreaturePickerComponent implements OnDestroy, OnInit {
  private destroy = new Subject();

  @Input()
  options: SelectOptions = [];
  @Input()
  set value(value: SelectOption | undefined) {
    if (value == null) {
      value = undefined;
    }

    this.control.setValue(value);
  }
  @Output()
  valueChange = new EventEmitter<SelectOption | undefined>();

  control = new FormControl();

  ngOnInit(): void {
    this.control.valueChanges.pipe(
      takeUntil(this.destroy),
    ).subscribe(value => this.valueChange.next(value));
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }
}
