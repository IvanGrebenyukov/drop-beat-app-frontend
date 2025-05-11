import { create } from 'zustand'


type FilterState = {
	searchQuery: string;
	selectedTags: string[];
	selectedGenres: string[];
	selectedMoods: string[];
	priceRange: [number, number];
	bpmRange: [number, number];
	currentPage: number;
	itemsPerPage: number;
	totalItems: number;
	
	actions: {
		setSearchQuery: (query: string) => void;
		toggleTag: (tagId: string) => void;
		toggleGenre: (genreId: string) => void;
		toggleMood: (moodId: string) => void;
		setPriceRange: (range: [number, number]) => void;
		setBpmRange: (range: [number, number]) => void;
		setPage: (page: number) => void;
		resetAllFilters: () => void;
		setTotalItems: (total: number) => void;
	};
};

export const useFiltersStore = create<FilterState>((set) => ({
	searchQuery: '',
	selectedTags: [],
	selectedGenres: [],
	selectedMoods: [],
	priceRange: [0, 100000],
	bpmRange: [10, 1000],
	currentPage: 1,
	itemsPerPage: 16,
	totalItems: 0,
	
	actions: {
		setSearchQuery: (query) => set({ searchQuery: query, currentPage: 1 }),
		toggleTag: (tagId) => set((state) => ({
			selectedTags: state.selectedTags.includes(tagId)
				? state.selectedTags.filter(id => id !== tagId)
				: [...state.selectedTags, tagId],
			currentPage: 1
		})),
		toggleGenre: (genreId) => set((state) => ({
			selectedGenres: state.selectedGenres.includes(genreId)
				? state.selectedGenres.filter(id => id !== genreId)
				: [...state.selectedGenres, genreId],
			currentPage: 1
		})),
		toggleMood: (moodId) => set((state) => ({
			selectedMoods: state.selectedMoods.includes(moodId)
				? state.selectedMoods.filter(id => id !== moodId)
				: [...state.selectedMoods, moodId],
			currentPage: 1
		})),
		setPriceRange: (range) => set({ priceRange: range, currentPage: 1 }),
		setBpmRange: (range) => set({ bpmRange: range, currentPage: 1 }),
		setPage: (page) => set({ currentPage: page }),
		resetAllFilters: () => set({
			searchQuery: '',
			selectedTags: [],
			selectedGenres: [],
			selectedMoods: [],
			priceRange: [0, 100000],
			bpmRange: [10, 1000],
			currentPage: 1,
			totalItems: 0
		}),
		setTotalItems: (total) => set({ totalItems: total })
	}
}));