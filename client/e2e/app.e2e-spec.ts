import { LifeshipPage } from './app.po';

describe('lifeship App', () => {
  let page: LifeshipPage;

  beforeEach(() => {
    page = new LifeshipPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
