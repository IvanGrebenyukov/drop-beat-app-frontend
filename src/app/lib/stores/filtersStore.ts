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
	
	actions: {
		setSearchQuery: (query: string) => void;
		toggleTag: (tagId: string) => void;
		toggleGenre: (genreId: string) => void;
		toggleMood: (moodId: string) => void;
		setPriceRange: (range: [number, number]) => void;
		setBpmRange: (range: [number, number]) => void;
		setPage: (page: number) => void;
		resetAllFilters: () => void;
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
	
	actions: {
		setSearchQuery: (query) => set({ searchQuery: query }),
		toggleTag: (tagId) => set((state) => ({
			selectedTags: state.selectedTags.includes(tagId)
				? state.selectedTags.filter(id => id !== tagId)
				: [...state.selectedTags, tagId]
		})),
		toggleGenre: (genreId) => set((state) => ({
			selectedGenres: state.selectedGenres.includes(genreId)
				? state.selectedGenres.filter(id => id !== genreId)
				: [...state.selectedGenres, genreId]
		})),
		toggleMood: (moodId) => set((state) => ({
			selectedMoods: state.selectedMoods.includes(moodId)
				? state.selectedMoods.filter(id => id !== moodId)
				: [...state.selectedMoods, moodId]
		})),
		setPriceRange: (range) => set({ priceRange: range }),
		setBpmRange: (range) => set({ bpmRange: range }),
		setPage: (page) => set({ currentPage: page }),
		resetAllFilters: () => set({
			searchQuery: '',
			selectedTags: [],
			selectedGenres: [],
			selectedMoods: [],
			priceRange: [0, 100000],
			bpmRange: [10, 1000],
			currentPage: 1
		})
	}
}));