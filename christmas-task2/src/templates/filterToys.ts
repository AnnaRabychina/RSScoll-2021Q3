import PageToys from '../pages/page-toys';
import { changeProperty } from '../services/services';
import { setLocalStorage } from '../services/storage';

abstract class FilterToys {
  protected container: HTMLElement;

  constructor() {
    this.container = document.createElement('div');
  }

  renderButtons(
    arrButtons: Array<string>,
    filterSet: Set<string>,
    field: string,
    parentNode: HTMLElement,
  ): void {
    arrButtons.forEach((button) => {
      const buttonHTML: HTMLButtonElement = document.createElement('button');
      buttonHTML.dataset[field] = button;
      if ([...filterSet] && [...filterSet].includes(button)) {
        buttonHTML.classList.add('active');
      }
      parentNode.append(buttonHTML);
    });
  }

  setFilterToys(filterSet: Set<string>, filter: string, keyStorage: string): void {
    this.container.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      const filterField = target.dataset[filter];
      changeProperty(target, 'active');
      if (target.classList.contains('active')) {
        filterSet.add(<string>filterField);
      } else {
        filterSet.delete(<string>filterField);
      }
      if ([...filterSet].length == 0) {
        localStorage.removeItem(keyStorage);
      } else {
        setLocalStorage(keyStorage, [...filterSet]);
      }
      PageToys.renderNewCardsContainer();
    });
  }
  
  render(): HTMLElement {
    return this.container;
  }
}

export default FilterToys;
