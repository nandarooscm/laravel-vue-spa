import axios from "axios";

export default {
    name: "ProductComponent",
    data() {
        return {
            isEditMode: false,
            products: {},
            search: '',
            product: new Form({
                id: '',
                name: '',
                price: ''
            }),
        };
    },
    methods: {
        view(page = 1) {
            this.$Progress.start()
            axios.get(`http://127.0.0.1:8000/api/products?page=${page}&search=${this.search}`)
                .then((response) => {
                    this.products = response.data;
                    this.$Progress.finish()
                })
                .catch(error => {
                    this.$Progress.fail()
                    console.log(error);
                })
        },
        create() {
            this.product.clear();
            this.isEditMode = false;
            this.product.reset();
        }
        ,
        store() {
            this.product.post("http://127.0.0.1:8000/api/products").then(() => {
                this.view();
                this.product.name = '';
                this.product.price = '';
                Toast.fire({
                    icon: 'success',
                    title: 'Created successfully!'
                })
            })
                .catch(error => {
                    console.warn(error.response.data.message);
                })
        },
        edit(product) {
            this.isEditMode = true;
            this.product.fill(product);
            this.product.clear();
        },
        update(product) {
            this.product.put(`http://127.0.0.1:8000/api/products/${product.id}`)
                .then(() => {
                    this.view();
                    this.isEditMode = false;
                    this.product.reset();
                    Toast.fire({
                        icon: 'success',
                        title: 'Updated successfully!'
                    })
                }).catch(error => {
                    console.warn(error.response.data.message);
                })
        },
        destroy(id) {
            Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
                if (result.isConfirmed) {
                    axios.delete(`http://127.0.0.1:8000/api/products/${id}`)
                        .then(() => {
                            this.view();
                            Toast.fire({
                                icon: 'success',
                                title: 'Deleted successfully!'
                            })
                        })

                }
            })
        }
    },
    created() {
        this.view();
    },
};