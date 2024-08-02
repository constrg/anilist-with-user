<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../../stores/user';
import Header from '../../layout/Header.vue';
import Table from '../../components/Table.vue';

const router = useRouter();
const userStore = useUserStore();
const user = ref(null);

onMounted(async () => {
    try {
        await userStore.fetchUsers();
        const userId = userStore.currentUser?.id;
        if (userId) {
            userStore.setCurrentUser(userId);
            user.value = userStore.currentUser;
        } else {
            router.push({ name: 'auth-forms' });
        }
    } catch (error) {
        console.log('Error fetching data', error);
        router.push({ name: 'auth-forms' });
    }
});
</script>

<template>
    <Header />
    <Table :user="user" />
</template>
