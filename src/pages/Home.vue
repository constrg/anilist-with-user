<script setup>
import { RouterLink } from 'vue-router';
import RimuruSlime from '../assets/images/rimuru-slime.png';
</script>

<template>
    <div :class="$style['home']">
        <div :class="[$style['home-content'], 'container']">
            <div :class="$style['character']">
                <img :class="$style['character-img']" :src="RimuruSlime" alt="rimuru-slime">
                <span :class="$style['character-greet-text']">Hello!</span>
            </div>
                <h1 :class="$style['home-text-title']">Welcome to AniList!</h1>
                <p :class="$style['home-text-p']">AniList is a platform for managing anime and manga collections, offering basic CRUD (Create, Read, Update, Delete) functions. Users can create accounts to track their progress, add new titles, update statuses, and remove items from their lists, making it easy to organize and maintain their personal libraries.</p>
                <RouterLink :class="$style['signin-signup-button']" :to="{ name: 'auth-forms' }">Sign in / Sign up</RouterLink>
           </div>
    </div>
</template>

<style module>
.home {
    position: relative;
    overflow: hidden;
    min-height: 100vh;
    background-color: rgb(var(--clr-accent));
    
}

.home-content
{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    min-height: 100vh;
    padding-block: 20px;
    color: rgb(var(--clr-light));
}

.character
{
    display: flex;
    align-items: center;
    position: relative;
}

.character-greet-text
{
    padding: 10px;
    background-color: rgb(var(--clr-light));
    border-radius: 10px 10px 10px 3px;
    color: rgb(var(--clr-accent));
    position: absolute;
    right: -40px;
    top: -20px;
    font-weight: var(--fw-medium);
    animation: float 3s infinite;
}

@keyframes float {
    0%, 100% 
    {
        transform: translateY(0) rotate(-5deg);
    }
    50% 
    {
        transform: translateY(5px) rotate(0);
    }
}

.character-img {
    width: 140px;
    position: relative;
}   

.home-text-title
{
    font-weight: var(--fw-bold);
    margin-bottom: 10px;
    font-size: var(--fs-medium);
}

.home-text-p
{
    margin-bottom: 20px;
    text-align: justify;
}

.signin-signup-button
{
    padding: 15px;
    font-weight: var(--fw-medium);
    border-radius: 5px;
    margin-bottom: 10px;
    border: 1px solid rgb(var(--clr-light));
}

.signin-signup-button:hover 
{
    background-color: rgb(var(--clr-light));
    color: rgb(var(--clr-accent));
}

</style>
