<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router'
import { AuthService } from '../services/auth';
import RimuruSlime from '../assets/images/rimuru-slime.png';


const router = useRouter();
const user = ref(null);
const confirmationModal = ref(false);

onMounted(() => {
    const storedUser = AuthService.getUser();
    if(storedUser) {
        user.value = storedUser;
    }
    else {
        router.push({name: 'auth-forms'});
    }
})

const openConfirmationModal = () => {
    confirmationModal.value = true;
}

const signOutHandler = () =>{
    AuthService.logout(router);
    user.value = null;
}
</script>
<template>
    <nav :class="$style['nav']">
        <div :class="[$style['nav-container'], 'container']">
            <div :class="$style['greet-user']">
                <img :src="RimuruSlime" :class="$style['greet-img']" alt="rimuru-slime">
                <h1 :class="$style['greet-text']"> Hello, {{ user ? user.username : 'Guest' }}</h1>
            </div>
            <button :class="$style['signout-button']" @click="openConfirmationModal">Sign Out</button>
        </div>
    </nav>

     <!-- Confirmation Modal -->
     <div :class="$style['modal-overlay']" v-show="confirmationModal">
        <div :class="$style['modal']">
            <div :class="$style['modal-container']">
                <header :class="$style['modal-header']">
                  <h1 :class="$style['modal-header-title']">Are you sure you want to sign out?</h1>
                </header>
                <div :class="$style['action-buttons']">
                    <button :class="$style['confirm-button']" @click="signOutHandler">Confirm</button>
                    <button :class="$style['cancel-button']" @click="confirmationModal = false">Cancel</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style module>
.nav 
{
    background-color: rgb(var(--clr-accent));
    width: 100%;
}
.nav-container
{
    padding-block: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.greet-user 
{
    display: flex;
    align-items: center;    
}

.greet-text
{
    color: rgb(var(--clr-light));
    font-weight: var(--fw-bold);
    font-size: var(--fs-base);
}

.greet-img 
{
    width: 50px;
    animation: jump 2s infinite;
}

@keyframes jump {
    0%, 100% {
        transform: translateY(0) rotate(0);
    }
    50% {
        transform: translateY(-5px) rotate(-3deg);
    }
}

.signout-button
{
    padding: 10px;
    font-size: var(--fs-small);
    font-weight: var(--fw-medium);
    background-color: rgb(var(--clr-light));
}
.signout-button:hover 
{
    background-color: rgb(var(--clr-light), 0.9);
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


.action-buttons
{
    display: flex;
    align-items: center;
    gap: 10px;
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

</style>