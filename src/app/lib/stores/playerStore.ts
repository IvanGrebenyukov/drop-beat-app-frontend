import { create } from 'zustand';

type PlayerState = {
	currentTrack: any | null;
	playlist: any[];
	isPlaying: boolean;
	volume: number;
	currentTime: number;
	duration: number;
	actions: {
		playTrack: (track: any, playlist?: any[]) => void;
		togglePlay: () => void;
		setVolume: (volume: number) => void;
		setCurrentTime: (time: number) => void;
		nextTrack: () => void;
		prevTrack: () => void;
		addToPlaylist: (track: any) => void;
		setDuration: (duration: number) => void;
	};
};

export const usePlayerStore = create<PlayerState>((set, get) => ({
	currentTrack: null,
	playlist: [],
	isPlaying: false,
	volume: 0.7,
	currentTime: 0,
	duration: 0,
	
	actions: {
		playTrack: (track, playlist = []) => {
			const newPlaylist = playlist.length > 0 ? playlist : [track];
			set({
				currentTrack: track,
				playlist: newPlaylist,
				isPlaying: true
			});
		},
		togglePlay: () => set({ isPlaying: !get().isPlaying }),
		setVolume: (volume) => set({ volume }),
		setCurrentTime: (currentTime) => set({ currentTime }),
		nextTrack: () => {
			const { playlist, currentTrack } = get();
			const currentIndex = playlist.findIndex(t => t.id === currentTrack?.id);
			const nextIndex = currentIndex < playlist.length - 1 ? currentIndex + 1 : 0;
			set({ currentTrack: playlist[nextIndex], isPlaying: true });
		},
		prevTrack: () => {
			const { playlist, currentTrack } = get();
			const currentIndex = playlist.findIndex(t => t.id === currentTrack?.id);
			const prevIndex = currentIndex > 0 ? currentIndex - 1 : playlist.length - 1;
			set({ currentTrack: playlist[prevIndex], isPlaying: true });
		},
		addToPlaylist: (track) => set((state) => ({
			playlist: [...state.playlist, track]
		})),
		setDuration: (duration) => set({ duration }),
	},
}));