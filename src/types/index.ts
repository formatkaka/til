export type TIL = {
  title: string;
  category: string;
  url: string;
  rawContent: string;
  frontmatter: {
    date?: string;
    tags?: string[];
    title?: string;
  };
}

export type FilterCriteria = {
  searchTerm: string;
  selectedTag: string;
  selectedCategory: string;
  sortBy: string;
}

export type ItemData = {
  tags: string[];
  category: string;
  title: string;
}

export type SortOption = 'name' | 'date-desc' | 'date-asc';