<template>
    <div>
        <h2>Usuarios</h2>
        <ul v-if="users.length">
            <li v-for="user in users" :key="user.id">
                {{ user.name }} - {{ user.email }}
            </li>
        </ul>
        <p v-else-if="error">{{ error }}</p>
        <p v-else>Cargando usuarios...</p>
    </div>
</template>

<script>
export default {
    name: 'UsersList',
    data() {
        return {
            users: [],
            error: null,
        };
    },
    mounted() {
        fetch('https://localhost:5000/public-users')

            .then(res => {
                if (!res.ok) throw new Error('Error al cargar usuarios');
                return res.json();
            })
            .then(data => {
                this.users = data;
            })
            .catch(err => {
                this.error = err.message;
            });
    },
};
</script>

<style scoped>
h2 {
    color: #2c3e50;
}
</style>