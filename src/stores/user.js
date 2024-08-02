import { defineStore } from 'pinia';
import axios from 'axios';

const api_url = 'http://localhost:3000/users';

export const useUserStore = defineStore('user', {
    state: () => ({
        users: [], 
        currentUser: null,
    }),
    actions: {
        async fetchUsers() {
            try {
                const res = await axios.get(api_url);
                this.users = res.data;
                const storedUser = JSON.parse(localStorage.getItem('user'));
                if (storedUser) {
                    this.setCurrentUser(storedUser.id);
                }
            } catch (error) {
                console.log('Error fetching users', error);
            }
        },
        setCurrentUser(userId) {
            this.currentUser = this.users.find(user => user.id === userId) || null;
            if (this.currentUser && !this.currentUser.animeList) {
                this.currentUser.animeList = [];
            }
            localStorage.setItem('user', JSON.stringify(this.currentUser));
        },
        clearCurrentUser() {
            this.currentUser = null;
            localStorage.removeItem('user');
        },
        async addAnime(anime) {
            if (this.currentUser) {
                this.currentUser.animeList.push(anime);
                if (!this.currentUser.animeList) {
                    this.currentUser.animeList = [];
                }
                try {
                    await axios.put(`${api_url}/${this.currentUser.id}`, this.currentUser);
                    localStorage.setItem('user', JSON.stringify(this.currentUser));
                } catch (error) {
                    console.log('Error adding anime', error);
                }
            }
        },
        async updateAnime(anime) {
            if (this.currentUser) {
                const index = this.currentUser.animeList.findIndex(a => a.id === anime.id);
                if (index !== -1) {
                    this.currentUser.animeList[index] = anime;
                    try {
                        await axios.put(`${api_url}/${this.currentUser.id}`, this.currentUser);
                        localStorage.setItem('user', JSON.stringify(this.currentUser));
                    } catch (error) {
                        console.log('Error updating anime', error);
                    }
                }
            }
        },
        async deleteAnime(animeId) {
            if (this.currentUser) {
                this.currentUser.animeList = this.currentUser.animeList.filter(anime => anime.id !== animeId);
                try {
                    await axios.put(`${api_url}/${this.currentUser.id}`, this.currentUser);
                    localStorage.setItem('user', JSON.stringify(this.currentUser));
                } catch (error) {
                    console.log('Error deleting anime', error);
                }
            }
        }
    },
    getters: {
        animeList: (state) => state.currentUser ? state.currentUser.animeList : []
    }
});
