

// Funzione princiapale
function martinosflix() {

    new Vue({
        el: '#vue',
        data: {
            search: '',
            filmList: [],
            serieList: [],
            api_key: '159bee94cc034456f8348926b952865b'
        },
        methods: {
            searchFilm: function () {
                if (this.search != '' && this.search[0] != ' ') {
                    console.log('Hai cercato: ' + this.search);

                    // API ricerca film per nome
                    axios.get('https://api.themoviedb.org/3/search/movie',
                        {
                            params:{
                                api_key: this.api_key,
                                query: this.search
                            }
                        }).then(data => {
                        console.log(data);
                        this.filmList = data.data.results
                        this.flagSrc 

                    }).catch(() => {
                        console.log('Error');
                    });

                    // API ricerca serie per nome
                    axios.get('https://api.themoviedb.org/3/search/tv',
                        {
                            params:{
                                api_key: this.api_key,
                                query: this.search
                            }
                        }).then(data => {
                        console.log(data);
                        this.serieList = data.data.results
                        this.flagSrc 
                    }).catch(() => {
                        console.log('Error');
                    })
                    // axios.get('https://api.themoviedb.org/3/search/movie?api_key=159bee94cc034456f8348926b952865b&query=' + this.search).then(data => {
                    //     console.log(data.data.results);
                    //     this.filmList = data.data.results
                    //     this.flagSrc 

                    // }).catch(() => {
                    //     console.log('Error');
                    // })
                }
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', martinosflix);