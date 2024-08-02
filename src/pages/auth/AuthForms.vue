<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { AuthService } from '../../services/auth';
import { useUserStore } from '../../stores/user';
import RimuruSlime from '../../assets/images/rimuru-slime.png';

const userStore = useUserStore();
const router = useRouter();
const api_url = 'http://localhost:3000/users';

onMounted(() => {
    userStore.fetchUsers();
});

const currentAuthForm = ref('signin-form');

const signInAuthFormData = reactive({
    username: '',
    password: ''
});

const signInAuthStatus = reactive({
    type: '',
    message: ''
});

const signUpAuthFormData = reactive({
    username: '',
    email: '',
    password: '',
});

const signUpAuthStatus = reactive({
    type: '',
    message: ''
});

const resetSignUpAuthFormData = () => {
    signUpAuthFormData.username = '';
    signUpAuthFormData.email = '';
    signUpAuthFormData.password = '';
}

const signInHandler = async () => {
    try {
        if (signInAuthFormData.username.trim() !== "" && signInAuthFormData.password.trim() !== "") {

            const user = userStore.users.find(user => user.username === signInAuthFormData.username &&
            user.password === signInAuthFormData.password);

            if (user) {
                AuthService.login(user);
                userStore.setCurrentUser(user.id);
                router.push({ name: 'user', params: { username: user.username } });
            } else {
                signInAuthStatus.type = 'error';
                signInAuthStatus.message = 'Invalid username or password';
                setTimeout(() => {
                    signInAuthStatus.type = '';
                    signInAuthStatus.message = '';
                }, 3000);
             
            }
        } else {
            signInAuthStatus.type = 'error';
            signInAuthStatus.message = 'Please input Username or password';
            setTimeout(() => {
                    signInAuthStatus.type = '';
                    signInAuthStatus.message = '';
                }, 3000);
        }
    } catch (error) {
        console.log('Error logging user', error)
    }
}

const signUpHandler = async () => {
    try {
        if(signUpAuthFormData.username.trim() !== "" &&
        signUpAuthFormData.email.trim() !== "" && 
        signUpAuthFormData.password.trim() !== "") {
            
            const usernameUsed = userStore.users.some(user => user.username.trim() === signUpAuthFormData.username.trim());
            const emailUsed = userStore.users.some(user => user.email.trim() === signUpAuthFormData.email.trim());
            if(usernameUsed) {
                signUpAuthStatus.type = 'error';
                signUpAuthStatus.message = 'Username used';

                setTimeout(() => {
                    signUpAuthStatus.type = ''; 
                    signUpAuthStatus.message = '';      
                }, 3000);
            } 
            else if(emailUsed) {
                signUpAuthStatus.type = 'error';
                signUpAuthStatus.message = 'Email used';

                setTimeout(() => {
                    signUpAuthStatus.type = ''; 
                    signUpAuthStatus.message = '';      
                }, 3000);
            }
            else {
                const newUser = {
                    username: signUpAuthFormData.username.trim(),
                    email: signUpAuthFormData.email.trim(),
                    password: signUpAuthFormData.password.trim(),
                }
                
                const res = await axios.post(api_url, newUser);
                userStore.users.push(res.data);

                signUpAuthStatus.type = 'success';
                signUpAuthStatus.message = 'Successfully Registered!'

                setTimeout(() => {
                    signUpAuthStatus.type = ''; 
                    signUpAuthStatus.message = '';      
                }, 3000);

                resetSignUpAuthFormData();
            } 
        } else {
            signUpAuthStatus.type = 'error';
            signUpAuthStatus.message = 'Please input the all fields';
                
            setTimeout(() => {
                signUpAuthStatus.type = ''; 
                signUpAuthStatus.message = '';      
            }, 3000);
        }
    } catch (error) {
        console.log('Error registering user', error)
    }
}

</script>
<template>

        <div :class="$style['forms']">
            <div :class="[$style['forms-container'], 'container']">

                <!-- Login Form -->
                    <form :class="$style['form']" @submit.prevent="signInHandler" v-if="currentAuthForm === 'signin-form'">
                        <header :class="$style['form-header']">
                            <h1 :class="$style['form-header-title']">Sign in Account</h1>
                        </header>
                        <div :class="$style['form-body']">
                            <p v-if="signInAuthStatus.type === 'success'" :class="$style['auth-status-success']">{{ signInAuthStatus.message }}</p>
                            <p v-if="signInAuthStatus.type === 'error'" :class="$style['auth-status-error']">{{ signInAuthStatus.message }}</p>
                            <div :class="$style['form-input-item']">
                                <label :class="$style['form-input-item-label']" for="form-input-username-holder">Username</label>
                                <input :class="$style['form-input-item-holder']" type="text" id="form-input-username-holder" autocomplete="username" placeholder="Input Username" v-model="signInAuthFormData.username">
                            </div>
                            <div :class="$style['form-input-item']">
                                <label :class="$style['form-input-item-label']" for="form-input-password-holder">Password</label>
                                <input :class="$style['form-input-item-holder']" type="password" id="form-input-password-holder" autocomplete="current-password" placeholder="Input Password" v-model="signInAuthFormData.password">
                            </div>
                            <button :class="$style['form-button']" type="submit">Sign in</button>
                        </div>
                        <div :class="$style['form-footer']">
                            <p :class="$style['form-footer-text']">Already have an account? <span :class="$style['link']" @click="currentAuthForm = 'signup-form'">Sign up</span></p>
                        </div>
                        <img :class="$style['form-img']" :src="RimuruSlime" alt="rimuru-slime">
                    </form>

                <!-- Registration Form -->
                    <form :class="$style['form']" @submit.prevent="signUpHandler" v-if="currentAuthForm === 'signup-form'">
                        <header :class="$style['form-header']">
                            <h1 :class="$style['form-header-title']">Register Account</h1>
                        </header>
                        <div :class="$style['form-body']">
                            <p v-if="signUpAuthStatus.type === 'success'" :class="$style['auth-status-success']">{{ signUpAuthStatus.message }}</p>
                            <p v-if="signUpAuthStatus.type === 'error'" :class="$style['auth-status-error']">{{ signUpAuthStatus.message }}</p>
                            <div :class="$style['form-input-item']">
                                <label :class="$style['form-input-item-label']" for="form-input-username-holder">Username</label>
                                <input :class="$style['form-input-item-holder']" type="text" id="form-input-username-holder" autocomplete="username" placeholder="Input Username" v-model="signUpAuthFormData.username">
                            </div>
                            <div :class="$style['form-input-item']">
                                <label :class="$style['form-input-item-label']" for="form-input-email-holder">Email</label>
                                <input :class="$style['form-input-item-holder']" type="email" id="form-input-email-holder" autocomplete="email" placeholder="Input Email" v-model="signUpAuthFormData.email">
                            </div>
                            <div :class="$style['form-input-item']">
                                <label :class="$style['form-input-item-label']" for="form-input-password-holder">Password</label>
                                <input :class="$style['form-input-item-holder']" type="password" id="form-input-password-holder" autocomplete="new-password" placeholder="Input Password" v-model="signUpAuthFormData.password">
                            </div>
                            <button :class="$style['form-button']" type="submit">Sign up</button>
                        </div>
                        <div :class="$style['form-footer']">
                            <p :class="$style['form-footer-text']">Already have an account? <span :class="$style['link']" @click="currentAuthForm = 'signin-form'">Sign in</span></p>
                        </div>
                        <img :class="$style['form-img']" :src="RimuruSlime" alt="rimuru-slime">
                    </form> 

            </div>
        </div>      

</template>

<style module>
.forms
{
    width: 100%;
    min-height: 100vh;
    background-size: cover;
    background-position: center;
    animation: background-changing 60s infinite;
}
.forms-container
{
    display: flex;
    align-items: center;
    min-height: 100vh;
    padding-block: 20px;
}

@keyframes background-changing {
    0%, 100%
    {
        background-image: url('../../assets/images/dragon-ball-goku-super-saiyan-power-desktop-wallpaper.jpg');
    }
    20% {
        background-image: url('../../assets/images/one-piece-luffy-battle-intense-desktop-wallpaper.jpg');
    }
    40%
    {
        background-image: url('../../assets/images/naruto-uzumaki-vibrant-energy-portrait-desktop-wallpaper.jpg');
    }
    60%
    {
        background-image: url('../../assets/images/bleach-ichigo-kurosaki-sword-desktop-wallpaper-4k.jpg');
    }
    80%
    {
        background-image: url('../../assets/images/fairy-tail-natsu-clipart-epic-flame-background-wallpaper-4k.jpg');
    }
}

.form
{
    background-color: rgb(var(--clr-light), 0.8);
    padding: 20px;
    border-radius: 10px;
    width: 100%;
    max-width: 400px;
    position: relative;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
}

.form-header
{
    margin-bottom: 20px;
}

.form-header-title
{
    color: rgb(var(--clr-accent));
    font-weight: var(--fw-bold);
}

.form-body
{
    display: flex;
    flex-direction: column;
    row-gap: 10px;
    margin-bottom: 20px;
}

.auth-status-success
{
    background-color: rgb(var(--clr-success));
    padding: 10px;
    color: rgb(var(--clr-light));
    border-radius: 5px;
    font-size: var(--fs-small);
}

.auth-status-error 
{

    background-color: rgb(Var(--clr-danger));
    padding: 10px;
    color: rgb(var(--clr-light));
    border-radius: 5px;
    font-size: var(--fs-small);
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

.form-input-item-holder
{
    background-color: rgb(var(--clr-gray));
    width: 100%;
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

.form-button:hover 
{
    background-color: rgb(var(--clr-accent), 0.9);
}

.form-footer-text
{
    font-size: 0.875rem;
    text-align: center;
}
.form-footer-text .link
{
    color: rgb(var(--clr-accent));
    font-weight: var(--fw-medium);
    cursor: pointer;
}

.form-img
{
    position: absolute;
    width: 100px;
    top: -30px;
    right: 0;
    animation: zoom-wiggle 4s infinite;
}

@keyframes zoom-wiggle {
      0%, 100% {
        transform: scale(1) rotate(0deg);
      }
      25% {
        transform: scale(1.2) rotate(-5deg);
      }
      50% {
        transform: scale(1.2) rotate(5deg);
      }
      75% {
        transform: scale(1.2) rotate(-5deg);
      }
    }
</style>
