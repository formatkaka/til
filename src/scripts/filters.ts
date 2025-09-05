import type { FilterCriteria, ItemData, SortOption } from '../types/index';

type ExtendedFilterCriteria = FilterCriteria & {
  sortBy: SortOption;
}

const ELEMENT_IDS = {
  SEARCH_INPUT: 'search-input',
  TAG_FILTER: 'tag-filter',
  CATEGORY_FILTER: 'category-filter',
  SORT_FILTER: 'sort-filter',
  CATEGORY_SECTIONS: 'category-sections',
  FLAT_LIST: 'flat-list'
} as const;

const DISPLAY_VALUES = {
  BLOCK: 'block',
  FLEX: 'flex',
  NONE: 'none'
} as const;

class TILFilterManager {
  private readonly searchInput: HTMLInputElement;
  private readonly tagFilter: HTMLSelectElement;
  private readonly categoryFilter: HTMLSelectElement;
  private readonly sortFilter: HTMLSelectElement;

  constructor() {
    this.searchInput = this.getElementById(ELEMENT_IDS.SEARCH_INPUT) as HTMLInputElement;
    this.tagFilter = this.getElementById(ELEMENT_IDS.TAG_FILTER) as HTMLSelectElement;
    this.categoryFilter = this.getElementById(ELEMENT_IDS.CATEGORY_FILTER) as HTMLSelectElement;
    this.sortFilter = this.getElementById(ELEMENT_IDS.SORT_FILTER) as HTMLSelectElement;

    this.initializeEventListeners();
  }

  private getElementById(id: string): HTMLElement {
    const element = document.getElementById(id);
    if (!element) {
      throw new Error(`Element with id "${id}" not found`);
    }
    return element;
  }

  private initializeEventListeners(): void {
    this.searchInput.addEventListener('input', () => this.filterAndSort());
    this.tagFilter.addEventListener('change', () => this.filterAndSort());
    this.categoryFilter.addEventListener('change', () => this.filterAndSort());
    this.sortFilter.addEventListener('change', () => this.filterAndSort());
  }

  private getFilterCriteria(): ExtendedFilterCriteria {
    return {
      searchTerm: this.searchInput.value.toLowerCase().trim(),
      selectedTag: this.tagFilter.value,
      selectedCategory: this.categoryFilter.value,
      sortBy: this.sortFilter.value
    };
  }

  private extractItemData(itemElement: HTMLElement): ItemData {
    const itemTagsRaw = itemElement.dataset.tags || '';
    const itemTags = itemTagsRaw ? itemTagsRaw.split(',') : [];
    const itemCategory = itemElement.dataset.category || '';
    const itemTitle = itemElement.querySelector('.file-link')?.textContent?.toLowerCase().replace(/^- /, '') || '';
    
    return {
      tags: itemTags,
      category: itemCategory,
      title: itemTitle
    };
  }

  private matchesFilters(itemData: ItemData, filters: ExtendedFilterCriteria): boolean {
    const searchMatch = !filters.searchTerm || itemData.title.includes(filters.searchTerm);
    const tagMatch = !filters.selectedTag || itemData.tags.includes(filters.selectedTag);
    const categoryMatch = !filters.selectedCategory || itemData.category === filters.selectedCategory;
    
    return searchMatch && tagMatch && categoryMatch;
  }

  private sortFileItems(fileList: HTMLElement, sortBy: SortOption): void {
    const items = Array.from(fileList.querySelectorAll('.file-item'));
    
    items.sort((a, b) => {
      const aElement = a as HTMLElement;
      const bElement = b as HTMLElement;
      
      if (sortBy === 'name') {
        const aText = aElement.querySelector('.file-link')?.textContent?.replace('- ', '') || '';
        const bText = bElement.querySelector('.file-link')?.textContent?.replace('- ', '') || '';
        return aText.localeCompare(bText);
      } else if (sortBy === 'date-desc' || sortBy === 'date-asc') {
        const aDateText = aElement.querySelector('.file-date')?.textContent?.replace(/[()]/g, '') || '';
        const bDateText = bElement.querySelector('.file-date')?.textContent?.replace(/[()]/g, '') || '';
        
        const aDate = aDateText ? new Date(aDateText) : new Date(0);
        const bDate = bDateText ? new Date(bDateText) : new Date(0);
        
        if (sortBy === 'date-desc') {
          return bDate.getTime() - aDate.getTime();
        } else {
          return aDate.getTime() - bDate.getTime();
        }
      }
      return 0;
    });
    
    items.forEach(item => fileList.appendChild(item));
  }

  private sortFileItemsFlat(fileList: HTMLElement, sortBy: SortOption): void {
    const items = Array.from(fileList.querySelectorAll('.file-item'));
    
    items.sort((a, b) => {
      const aElement = a as HTMLElement;
      const bElement = b as HTMLElement;
      
      const aDateText = aElement.dataset.date || '';
      const bDateText = bElement.dataset.date || '';
      
      const aDate = aDateText ? new Date(aDateText) : new Date(0);
      const bDate = bDateText ? new Date(bDateText) : new Date(0);
      
      if (sortBy === 'date-desc') {
        return bDate.getTime() - aDate.getTime();
      } else {
        return aDate.getTime() - bDate.getTime();
      }
    });
    
    items.forEach(item => fileList.appendChild(item));
  }

  private handleCategoryView(): void {
    const filters = this.getFilterCriteria();
    const categorySectionsDiv = this.getElementById(ELEMENT_IDS.CATEGORY_SECTIONS);
    const sections = categorySectionsDiv.querySelectorAll('.category-section');
    const fileItems = categorySectionsDiv.querySelectorAll('.file-item');

    fileItems.forEach(item => {
      const itemElement = item as HTMLElement;
      const itemData = this.extractItemData(itemElement);
      
      if (this.matchesFilters(itemData, filters)) {
        itemElement.style.setProperty('display', DISPLAY_VALUES.BLOCK, 'important');
      } else {
        itemElement.style.setProperty('display', DISPLAY_VALUES.NONE, 'important');
      }
    });

    sections.forEach(section => {
      const sectionElement = section as HTMLElement;
      const fileList = sectionElement.querySelector('.file-list') as HTMLElement;
      if (fileList) {
        this.sortFileItems(fileList, filters.sortBy);
      }
      
      const hasAnyFilters = filters.searchTerm || filters.selectedTag || filters.selectedCategory;
      if (hasAnyFilters) {
        const hasVisibleItems = Array.from(sectionElement.querySelectorAll('.file-item')).some(item => {
          const itemElement = item as HTMLElement;
          return !itemElement.style.display || itemElement.style.display !== 'none';
        });
        
        sectionElement.style.display = hasVisibleItems ? 'block' : 'none';
      } else {
        sectionElement.style.display = 'block';
      }
    });
  }

  private handleFlatDateView(): void {
    const filters = this.getFilterCriteria();
    const flatListDiv = this.getElementById(ELEMENT_IDS.FLAT_LIST);
    const flatItems = flatListDiv.querySelectorAll('.file-item');
    
    flatItems.forEach(item => {
      const itemElement = item as HTMLElement;
      const itemData = this.extractItemData(itemElement);

      if (this.matchesFilters(itemData, filters)) {
        itemElement.style.setProperty('display', DISPLAY_VALUES.FLEX, 'important');
      } else {
        itemElement.style.setProperty('display', DISPLAY_VALUES.NONE, 'important');
      }
    });
    
    const flatFileList = flatListDiv.querySelector('.file-list') as HTMLElement;
    if (flatFileList) {
      this.sortFileItemsFlat(flatFileList, filters.sortBy);
    }
  }

  public filterAndSort(): void {
    const filters = this.getFilterCriteria();
    const isDateSort = filters.sortBy === 'date-desc' || filters.sortBy === 'date-asc';
    
    const categorySectionsDiv = this.getElementById(ELEMENT_IDS.CATEGORY_SECTIONS);
    const flatListDiv = this.getElementById(ELEMENT_IDS.FLAT_LIST);
    
    if (isDateSort) {
      categorySectionsDiv.style.display = DISPLAY_VALUES.NONE;
      flatListDiv.style.display = DISPLAY_VALUES.BLOCK;
      this.handleFlatDateView();
    } else {
      categorySectionsDiv.style.display = DISPLAY_VALUES.BLOCK;
      flatListDiv.style.display = DISPLAY_VALUES.NONE;
      this.handleCategoryView();
    }
  }
}

// Initialize the filter manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new TILFilterManager();
});

export { TILFilterManager };