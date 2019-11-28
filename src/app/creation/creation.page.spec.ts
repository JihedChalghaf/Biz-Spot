import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CreationPage } from './creation.page';

describe('CreationPage', () => {
  let component: CreationPage;
  let fixture: ComponentFixture<CreationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreationPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CreationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
