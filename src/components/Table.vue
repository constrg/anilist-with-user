<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import { useUserStore } from '../stores/user';


const userStore = useUserStore();
const addAnimeForm = ref(false);
const updateAnimeForm = ref(false);
const searchBar = ref('');
const confirmationModal = ref(false);
const deleteAnimeItem = ref(null);
const isUpButtonActive = ref(false);
const filterStatus = ref('All');

const props = defineProps({
    user: {
        type: Object,
        default: () => ({})
    }
});


const addAnimeData = reactive({
    animeTitle: "",
    animeStatus: ""
});

const updateAnimeData = reactive({
    id: null,
    animeTitle: "",
    animeStatus: ""
});

const generateRandomId = () => {
    return Math.random().toString(36).substr(2, 9);
};

const addAnimeHandler = async () => {
    try {
        if(addAnimeData.animeTitle.trim() !== "" && addAnimeData.animeStatus.trim() !== "")
        {
            const newAnime = {
                id: generateRandomId(),
                animeTitle: addAnimeData.animeTitle.trim(),
                animeStatus: addAnimeData.animeStatus.trim()
            }

            await userStore.addAnime(newAnime);

            addAnimeForm.value = false;
            addAnimeData.animeTitle = "";
            addAnimeData.animeStatus = "";
            
        }
    } catch (error) {
        console.log('Error adding data', error);
    }
}

const openUpdateForm = (anime) => {
    updateAnimeData.id = anime.id;
    updateAnimeData.animeTitle = anime.animeTitle;
    updateAnimeData.animeStatus = anime.animeStatus;
    updateAnimeForm.value = true;
};

const updateAnimeHandler = async () => {
    try {
        if(updateAnimeData.animeTitle.trim() !== "" && updateAnimeData.animeStatus.trim() !== "")
        {
            const updatedAnime = {
                id: updateAnimeData.id,
                animeTitle: updateAnimeData.animeTitle.trim(),
                animeStatus: updateAnimeData.animeStatus.trim()
            }

            await userStore.updateAnime(updatedAnime);

            updateAnimeForm.value = false;
            updateAnimeData.id = null;
            updateAnimeData.animeTitle = "";
            updateAnimeData.animeStatus = "";
            
        }
    } catch (error) {
        console.log('Error updating data', error);
    }
}

const deleteAnimeHandler = async () => {
    if(deleteAnimeItem.value === null) return;

    try {
        await userStore.deleteAnime(deleteAnimeItem.value);
        confirmationModal.value = false;
        deleteAnimeItem.value = null;
        
    } catch (error) {
        console.log('Error deleting data', error);
    }
};


const openConfirmationModal = (animeId) => {
    deleteAnimeItem.value = animeId;
    confirmationModal.value = true;
}


const filteredAnimeList = computed(() => {
    const query = searchBar.value.toLowerCase();
    const animeList = props.user?.animeList || [];

    return animeList
        .filter(anime => anime.animeTitle.toLowerCase().includes(query))
        .filter(anime => filterStatus.value === 'All' || anime.animeStatus === filterStatus.value);
});
const hasResults = computed(() => filteredAnimeList.value.length > 0);

const scrollHandler = () => {
    isUpButtonActive.value = window.scrollY > 100;
};

onMounted(() => {
    window.addEventListener('scroll', scrollHandler);
});

onUnmounted(() => {
    window.removeEventListener('scroll', scrollHandler);
});

const scrollUp = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

</script>


<template>
    
    <header :class="$style['header']">
        <div :class="[$style['header-container'], 'container']">
            <h1 :class="$style['table-title']">Your AniList [{{ filteredAnimeList.length }}]</h1>
            <button :class="$style['add-button']" @click="addAnimeForm = true">Add Anime</button>    
        </div>   
    </header>

    <div class="container">
        <input type="text" :class="$style['search-bar']" placeholder="Search Anime..." v-model="searchBar"> 
        <div :class="$style['table-container']">
                <table :class="$style['table']" v-if="props.user">
                    <thead :class="$style['thead']">
                        <tr :class="$style['tr']">
                            <th :class="[$style['th'], $style['anime-title']]">Anime Title</th>
                            <th :class="[$style['th'], $style['anime-status']]">Status 
                                <select :class="$style['filter-anime-status']" v-model="filterStatus">
                                    <option value="All">All</option>
                                    <option value="Watching">Watching</option>
                                    <option value="Watched">Watched</option>
                                </select>
                            </th>
                            <th :class="$style['th']">Action</th>
                        </tr>
                    </thead>
                    <tbody :class="$style['tbody']">
                        <tr :class="$style['tr']" v-for="anime in filteredAnimeList" :key="anime.id" v-if="hasResults">
                            <td :class="$style['td']">{{ anime.animeTitle }}</td>
                            <td :class="[ $style['td'], anime.animeStatus === 'Watched' ? $style['anime-status-watched'] : anime.animeStatus === 'Watching' ? $style['anime-status-watching'] : '' ]">{{ anime.animeStatus }}</td>
                            <td :class="[$style['td'], $style['action-buttons']]">
                                <button :class="$style['update-button']" @click="openUpdateForm(anime)">Update</button>
                                <button :class="$style['delete-button']" @click="openConfirmationModal(anime.id)">Delete</button>
                            </td>
                        </tr>
                        <tr :class="$style['tr']" v-if="!hasResults">
                            <td :colspan="3" :class="$style['td']">
                                <h2 :class="$style['no-anime-found']">No Anime Found</h2>
                            </td>
                        </tr>
                    </tbody>
                </table>
        </div>
    </div>

    <!-- Add Form -->
    <div :class="$style['form-overlay']" v-show="addAnimeForm">
        <form :class="$style['form']" @submit.prevent="addAnimeHandler">
            <header :class="$style['form-header']">
                <h1 :class="$style['form-header-title']">Add Anime</h1>
                <button :class="$style['close-button']"  @click="addAnimeForm = false">Close</button>
            </header>
            <div :class="$style['form-body']">
                <div :class="$style['form-input-item']">
                    <label :class="$style['form-input-item-label']" for="form-input-username-holder">Anime Title</label>
                    <input :class="$style['form-input-item-holder']" type="text" id="form-input-username-holder" autocomplete="username" placeholder="Input Anime Title" v-model="addAnimeData.animeTitle">
                </div>
                <div :class="$style['form-input-item']">
                    <label :class="$style['form-input-item-label']" for="form-input-username-holder">Status</label>
                    <select :class="$style['select-anime-status']" v-model="addAnimeData.animeStatus">
                        <option :class="$style['option-anime-status']" value="" disabled selected>Select Status</option>
                        <option :class="$style['option-anime-status']" value="Watching">Watching</option>
                        <option :class="$style['option-anime-status']" value="Watched">Watched</option>
                    </select>
                </div>
                <button :class="$style['form-button']" type="submit">Add Anime</button>
            </div>
        </form> 
    </div>

    <!-- Update Form -->
    <div :class="$style['form-overlay']" v-show="updateAnimeForm">
        <form :class="$style['form']" @submit.prevent="updateAnimeHandler">
            <header :class="$style['form-header']">
                <h1 :class="$style['form-header-title']">Update Anime</h1>
                <button :class="$style['close-button']"  @click="updateAnimeForm = false">Close</button>
            </header>
            <div :class="$style['form-body']">
                <div :class="$style['form-input-item']">
                    <label :class="$style['form-input-item-label']" for="form-input-username-holder">Anime Title</label>
                    <input :class="$style['form-input-item-holder']" type="text" id="form-input-username-holder" autocomplete="username" placeholder="Input Anime Title" v-model="updateAnimeData.animeTitle">
                </div>
                <div :class="$style['form-input-item']">
                    <label :class="$style['form-input-item-label']" for="form-input-username-holder">Status</label>
                    <select :class="$style['select-anime-status']" v-model="updateAnimeData.animeStatus">
                        <option :class="$style['option-anime-status']" value="" disabled selected>Select Status</option>
                        <option :class="$style['option-anime-status']" value="Watching">Watching</option>
                        <option :class="$style['option-anime-status']" value="Watched">Watched</option>
                    </select>
                </div>
                <button :class="$style['form-button']" type="submit">Update Anime</button>
            </div>
        </form> 
    </div>
    
    <!-- Confirmation Modal -->
    <div :class="$style['modal-overlay']" v-show="confirmationModal">
        <div :class="$style['modal']">
            <div :class="$style['modal-container']">
                <header :class="$style['modal-header']">
                  <h1 :class="$style['modal-header-title']">Are you sure you want to delete this data?</h1>
                </header>
                <div :class="$style['action-buttons']">
                    <button :class="$style['confirm-button']" @click="deleteAnimeHandler">Confirm</button>
                    <button :class="$style['cancel-button']" @click="confirmationModal = false">Cancel</button>
                </div>
            </div>
        </div>
    </div>

    <button :class="[$style['up-button'], isUpButtonActive ? $style['up-button-active'] : '']" @click="scrollUp">Up</button>
</template>

<style module>
/* Table */
.table-container {
    overflow: auto;
}

.header-container
{
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    width: 100%;
    margin-block: 20px 10px;
}

.table-title
{
    color: rgb(var(--clr-accent));
    font-size: var(--fs-medium);
    font-weight: var(--fw-bold);
    font-family: var(--ff-title);
}

.add-button
{
    padding: 10px;
    background-color: rgb(var(--clr-accent));
    color: rgb(var(--clr-light));
    font-size: var(--fs-small);
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    font-weight: var(--fw-medium);
}

.add-button:hover 
{
    background-color: rgb(var(--clr-accent), 0.9);
}

.search-bar
{
    padding: 10px;
    width: 100%;
    background-color: rgb(var(--clr-accent),0.1);
    margin-bottom: 10px;
}

.table {
    width: 100%;
    border-collapse: separate;
    text-align: left;
    height: 100%;
}

.thead {
    padding: 20px;
    background-color: rgb(var(--clr-accent));
}

.th {
    padding: 10px;
    color: rgb(var(--clr-light));
    border-radius: 5px;
    font-weight: var(--fw-medium);
}

.td {
    padding: 10px;
    background-color: rgb(var(--clr-accent), 0.1);
    border-radius: 5px;
    height: 100%;
}

.anime-title
{
    width: 100%;
}

.anime-status
{
    display: flex;
    justify-content: space-between;
    align-items: center;
    column-gap: 20px;
}

.filter-anime-status
{
    padding: 5px;
    font-size: var(--fs-small);
}

.anime-status-watched
{
    color: rgb(var(--clr-light));
    background-color: rgb(var(--clr-success));
}

.anime-status-watching
{
    color: rgb(var(--clr-light));
    background-color: rgb(var(--clr-warning));
}

.action-buttons
{
    display: flex;
    align-items: center;
    gap: 10px;
}

.delete-button
{
    background-color: rgb(var(--clr-danger));
    color: rgb(var(--clr-light));
    padding: 10px;
    width: 100%;
    font-size: var(--fs-small);
    font-weight: var(--fw-medium);
}

.delete-button:hover 
{
    background-color: rgb(var(--clr-danger), 0.9);
}

.update-button
{
    background-color: rgb(var(--clr-warning));
    color: rgb(var(--clr-light));
    padding: 10px;
    width: 100%;
    font-size: var(--fs-small);
    font-weight: var(--fw-medium);
}

.update-button:hover 
{
    background-color: rgb(var(--clr-warning), 0.9);
}

.no-anime-found
{
    color: rgb(var(--clr-danger));
    font-weight: var(--fw-medium);
}

/* Form */
.form-overlay
{
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgb(var(--clr-dark), 0.9);
    width: 100%;
    min-height: 100%;
    z-index: 999;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-inline: 20px;
}

.form
{
    background-color: rgb(var(--clr-light), 0.8);
    padding: 20px;
    border-radius: 10px;
    width: 100%;
    max-width: 500px;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
}

.form-header 
{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.form-header-title
{
    color: rgb(var(--clr-accent));
    font-weight: var(--fw-bold);
}

.close-button
{
    padding: 5px;
    background-color: rgb(var(--clr-danger));
    color: rgb(var(--clr-light));
}

.form-body
{
    display: flex;
    flex-direction: column;
    row-gap: 10px;
    margin-bottom: 20px;
}

.form-input-item
{
    display: flex;
    flex-direction: column;
    row-gap: 5px;
}

.form-input-item-label 
{
    font-weight: var(--fw-medium);
}

.form-input-item-holder, 
.select-anime-status
{
    background-color: rgb(var(--clr-gray));
    width: 100%;
    padding: 15px;
}

.option-anime-status
{
    padding: 15px;
}

.form-button
{
    background-color: rgb(var(--clr-accent));
    color: rgb(var(--clr-light));
    font-weight: var(--fw-semi-bold);
    width: 100%;
    padding: 15px;
}


/* Modal */
.modal-overlay
{
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgb(var(--clr-dark), 0.9);
    width: 100%;
    min-height: 100%;
    z-index: 999;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-inline: 20px;
}

.modal 
{ 
    background-color: rgb(var(--clr-light), 0.8);
    border-radius: 10px;
    width: 100%;
    max-width: 500px;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
}

.modal-container 
{
    padding-block: 20px;
    padding: 20px;
}

.modal-header
{
    width: 100%;
    margin-bottom: 20px;
}

.modal-header-title
{
    color: rgb(var(--clr-accent));
    font-weight: var(--fw-bold);
}


.confirm-button
{
    background-color: rgb(var(--clr-danger));
    color: rgb(var(--clr-light));
    padding: 10px;
    font-weight: var(--fw-medium);
}

.cancel-button
{
    background-color: rgb(var(--clr-accent));
    color: rgb(var(--clr-light));
    padding: 10px;
    font-weight: var(--fw-medium);
}

.up-button
{
    position: fixed;
    right: 20px;
    bottom: 0;
    padding: 10px;
    background-color: rgb(var(--clr-accent));
    color: rgb(var(--clr-light));
    box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
    opacity: 0;
    transform: translateY(100%);
    transition-duration: 0.3s;
}

.up-button:hover 
{
    background-color: rgb(var(--clr-accent), 0.9);
}

.up-button.up-button-active
{
    transform: translateY(0%);
    bottom: 10px;
    opacity: 1;
}

</style>
