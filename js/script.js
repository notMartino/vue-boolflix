// Funzione princiapale
function martinosflix() {

    new Vue({
        el: '#vue',
        data: {
            search: '',
            filmList: [],
            serieList: [],
            api_key: '159bee94cc034456f8348926b952865b',
            starClass: '',
        },
        computed:{
            films: function () {
                return this.filmList.map((film) =>{
                    let stars = film.vote_average ;
                    let rating = Math.round((5 * stars) / 10);

                    let newFilm = {...film};
                    newFilm.vote_average = rating;
                    return newFilm;
                });
            },
            series: function () {
                return this.serieList.map((serie) =>{
                    let stars = serie.vote_average ;
                    let rating = Math.round((5 * stars) / 10);

                    let newserie = {...serie};
                    newserie.vote_average = rating;
                    return newserie;
                });
            }
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
                                console.log('Films: ', data.data.results);
                                this.filmList = data.data.results;
                               
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
                                console.log('Serie TV: ', data.data.results);
                                this.serieList = data.data.results;
                                
                        }).catch(() => {
                            console.log('Error');
                    });
                }
            }
            // starRating: function (film) {
            //     let stars = film.vote_average;
            //     return rating = Math.round((5 * stars) / 10);
                // return rating;

                // let iconClass = '';

                // if(rating <= index) {
                //     iconClass = 'far fa-star';
                // }else{
                //     iconClass = 'fas fa-star';
                // }

                // return iconClass;
            // }
        }
    });
}

document.addEventListener('DOMContentLoaded', martinosflix);