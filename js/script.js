

// Funzione princiapale
function martinosflix() {

    new Vue({
        el: '#vue',
        data: {
            search: '',
            filmList: []
        },
        methods: {
            searchFilm: function () {
                if (this.search != '' && this.search[0] != ' ') {
                    console.log('Hai cercato: ' + this.search);
                    axios.get('https://api.themoviedb.org/3/search/movie?api_key=159bee94cc034456f8348926b952865b&query=' + this.search).then(data => {
                        console.log(data.data.results);
                        this.filmList = data.data.results
                        console.log(this.search);
                    }).catch(() => {
                        console.log('Error');
                    })
                }
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', martinosflix);
