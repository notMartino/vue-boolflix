// Funzione princiapale
function martinosflix() {
    new Vue({
        el: '#vue',
        data: {
            activeHamburger: false,
            searched: false,
            search: '', // Stringa ricerca (v-model)
            popularFilm: [], // Lista film popolari
            filmList: [], // Lista films cercati
            serieList: [], // Lista serie cercate
            api_key: '159bee94cc034456f8348926b952865b', // API key fisso
            nameList: [], // Lista nomi attori film/serie cliccata
            genreList: [], // Lista generi film/serie cliccata
            show: '', // classe display block
            genresList: [], // Lista generi
            OldFilmsList: [], // Lista iniziale films
            OldSeriesList: [], // Lista iniziale series
            filter: 0,// ID filtro genere
            counterFilterFilm: 0, // Contatore per ritornare a lista films completa dopo filtraggio
            counterFilterSerie: 0, // Contatore per ritornare a lista serie completa dopo filtraggio
            carouselFilmsIndex: 0, // Indice limite max. box films
            carouselSeriesIndex: 0, // Indice limite max. box series
            carouselItems: 0, // Items box massime per grandezza pagina
            carouselCounterFilms: 1, // Moltiplicatore swipe films
            carouselCounterSeries: 1, // Moltiplicatore swipe series
            viewWidth: 0, // Larghezza Window in px
            modalActive: false, // Modale attivo
            videoActive: false, // Video attivo in modal
            videoLink: '', // Link del video
            imageLink: '', // Immagine copertina modale (No video, screen < Ypx)
            modalItem: {}, // Obj film/serie da usare nel modale
            modalType: '', // Tipo di modale - film/serie (nomi proprietà diversi)
        },
        mounted: function () {
            // Richiamo la funzione film popolari a pagina montata
            this.getPopular();
            
            // Ascoltatore su window resize per numero box
            window.addEventListener('resize', this.carousel);
        },
        computed:{
            // Generatore lista films copiata, con stelle in base 5
            films: function () {
                return this.arrayMap(this.filmList);
            },
            // Generatore lista serie copiata, con stelle in base 5
            series: function () {
                return this.arrayMap(this.serieList);
            },
        },
        methods: {
            // Hamburer menu
            hamburgerMenu: function(){
                this.activeHamburger = !this.activeHamburger;
            },
            // Funzione genera film/serie popolari
            getPopular: function () {
                // Film popolari
                axios.get('https://api.themoviedb.org/3/movie/popular',
                {
                    params:{
                        api_key: this.api_key,
                        language: 'en-US',
                        page: 1
                    }
                }).then(data => {
                    console.log('Popular: ', data.data.results);
                    this.filmList = data.data.results;
                    this.carousel('film');

                    // Inserisco in lista filtri tutti i generi disponibili da API
                    this.getGenres('movie');
                }).catch(() => {
                    console.log('Errore: acquisizione film popolari');
                });

                // Serie popolari
                axios.get(' https://api.themoviedb.org/3/tv/popular',
                {
                    params:{
                        api_key: this.api_key,
                            language: 'en-US',
                            page: 1
                        }
                    }).then(data => {
                        console.log('Popular: ', data.data.results);
                        this.serieList = data.data.results;
                        this.carousel('serie');

                        // Inserisco in lista filtri tutti i generi disponibili da API
                        this.getGenres('tv');
                    }).catch(() => {
                        console.log('Errore: acquisizione serie popolari');
                }); 
            },
            // Lista generica copiata, con stelle in base 5
            arrayMap: function (arrayList) {
                return arrayList.map((film) => {
                    let stars = film.vote_average;
                    let rating = Math.round((5 * stars) / 10);
    
                    // console.log(this.jumbofilm == false);
                    let newItem = {...film};
                    newItem.vote_average = rating;
                    return newItem;
                });
            },
            // Funzione chiamata al resize window, modifica il num di box visibli
            carousel: function (types = 0) {
                this.viewWidth  = window.innerWidth;

                let carouselIndex = 0;
                let carouselCounter = 1;
                let listLength = 0;

                // Mounted, il tipo non viene specificato richiamo entrambe
                if(types != 'film' && types != 'serie'){
                    this.carousel('film');
                    this.carousel('serie');
                }


                if (types == 'film') {
                    carouselCounter = this.carouselCounterFilms;
                    listLength = this.filmList.length;
                    // console.log('aa', types ,this.filmList);
                }else if(types == 'serie'){
                    carouselCounter = this.carouselCounterSeries;
                    listLength = this.serieList.length;
                }

                if (types == 'film' || types == 'serie') {
                    if (this.viewWidth >= 1600) {
                        carouselIndex = 8 * carouselCounter;
                        this.carouselItems = 8;
                    }
                    else if(this.viewWidth > 1499 && this.viewWidth < 1600){
                        carouselIndex = 7 * carouselCounter;
                        this.carouselItems = 7;
                    }
                    else if(this.viewWidth <= 1499 && this.viewWidth > 1199){
                        carouselIndex = 6 * carouselCounter;
                        this.carouselItems = 6;
                    }
                    else if(this.viewWidth <= 1199  && this.viewWidth > 767){
                        carouselIndex = 4 * carouselCounter;
                        this.carouselItems = 4;

                        // Al cambio di screen width metto video
                        if (this.modalActive & this.viewWidth > 767  && this.videoActive == false) {
                            this.modalView(this.modalItem, this.modalType);
                        }
                    }
                    else if(this.viewWidth <= 767  && this.viewWidth > 575){
                        carouselIndex = 3 * carouselCounter;
                        this.carouselItems = 3;

                        // Al cambio di screen width tolgo video
                        if (this.modalActive && this.viewWidth  <= 767 && this.videoActive == true) {
                            this.modalView(this.modalItem, this.modalType);
                        }
                    }
                    else if(this.viewWidth <= 575){
                        carouselIndex = listLength;

                        // Tengo il numero più alto di item per evitare cut di film/serie
                        if(this.carouselItems < listLength){
                            this.carouselItems = listLength;
                        }
                        console.log('list', listLength, types);
                    }
                }

                if (types == 'film') {
                    this.carouselFilmsIndex = carouselIndex;
                }else if(types == 'serie'){
                    this.carouselSeriesIndex = carouselIndex;
                }
            },
            // Funzioni di swipe films/series
            swipeRightFilms: function () {
                this.carouselCounterFilms ++;
                this.carouselFilmsIndex  += this.carouselItems;
            },
            swipeLeftFilms: function () {
                this.carouselCounterFilms --;
                this.carouselFilmsIndex  -= this.carouselItems;
            },
            swipeRightSeries: function () {
                this.carouselCounterSeries ++;
                this.carouselSeriesIndex  += this.carouselItems;
            },
            swipeLeftSeries: function () {
                this.carouselCounterSeries --;
                this.carouselSeriesIndex  -= this.carouselItems;
            },
            // Funzione che rende active le box designate (films)
            filmBoxClasses: function(index) {
                let returned = [];
                
                // Ritorno active se l'indice delle box rientra nel range
                if (index < this.carouselFilmsIndex && (index >= (this.carouselFilmsIndex - this.carouselItems))) {
                    returned.push('active');
                }

                // Ritorno dx/sx se l'indice delle box precede/succede le box active
                if (index >= this.carouselFilmsIndex) {
                    returned.push('right');
                }else if(index < (this.carouselFilmsIndex - this.carouselItems)){
                    returned.push('left');
                }

                // console.log('Films carousel:', this.carouselFilmsIndex, this.carouselItems);
                // console.log('Series carousel:', this.carouselSeriesIndex, this.carouselItems);
                return returned;
            },
            // Funzione che torna la classe active alle box designate (series)
            serieBoxClasses: function(index) {
                let returned = [];

                // Ritorno active se l'indice delle box rientra nel range
                if (index < this.carouselSeriesIndex && (index >= (this.carouselSeriesIndex - this.carouselItems))) {
                    returned.push('active');
                }
                // Ritorno dx/sx se l'indeice delle box precede/succede le box active
                if (index >= this.carouselSeriesIndex) {
                    returned.push('right');
                }else if(index < (this.carouselSeriesIndex - this.carouselItems)){
                    returned.push('left');
                }

                return returned;
            },
            // Funzione ricerca per titolo film/serie
            searchFilm: function (type) {
                this.filter = 0;

                if (this.search != '' && this.search[0] != ' ') {
                    console.log("You've searched ("+ type + '): ' + this.search);
                    this.searched = true;

                    this.counterFilterFilm = 0;
                    this.counterFilterSerie = 0;
                    
                    // API ricerca film/serie per nome
                    axios.get('https://api.themoviedb.org/3/search/' + type,
                    {
                        params:{
                        api_key: this.api_key,
                        query: this.search
                    }
                    }).then(data => {
                        
                        if (type == 'movie') {
                            console.log('Films: ', data.data.results);
                            this.filmList = data.data.results;
                        }else{
                            console.log('Series: ', data.data.results);
                            this.serieList = data.data.results;
                        }
                        
                        this.carouselCounterFilms = 1;
                        this.carouselCounterSeries = 1;
                        this.carousel('film');
                        this.carousel('serie');
                            
                    }).catch(() => {
                        console.log('Errore: ricerca film');
                    });
                }   
            },
            actorsAndGenres: function (id, type) {
                this.cleanList();

                // API attori e generi per ID
                axios.get('https://api.themoviedb.org/3/' + type + '/' + id, 
                {
                    params:{
                        api_key: this.api_key,
                        append_to_response: 'credits'
                    }
                }).then(data => {
                    let axiosActors = data.data.credits.cast.slice(0,5);
                    for (let i = 0; i < axiosActors.length; i++) {
                        const element = axiosActors[i];
                        this.nameList.push(element.original_name);
                    }
                    
                    // Se si tratta di una serie (attr. "name")
                    let axiosGenres = data.data.genres;
                    for (let i = 0; i < axiosGenres.length; i++) {
                        const element = axiosGenres[i];
                        this.genreList.push(element.name);
                    }
                    // this.show = 'show';
                    // this.slicedWord = 1000;

                    console.log(id, this.nameList);
                    console.log(this.genreList);
                    }).catch(() => {
                        console.log('Error');
                });
            },
            // Funzione pulizia attori/generi
            cleanList: function () {
                this.show = '';
                this.nameList = [];
                this.genreList = [];
                // this.slicedWord = 50;
            },
            // Funzione ricerca generi disponibili
            getGenres: function (type) {
                axios.get('https://api.themoviedb.org/3/genre/'+ type +'/list',
                {
                    params:{
                        api_key: this.api_key,
                        language: 'en-US'
                    }
                }).then(data => {
                    let arrayGenres = data.data.genres;
                    
                    for (let i = 0; i < arrayGenres.length; i++) {
                        let cont = 0;
                        for (let j = 0; j < this.genresList.length; j++) {
                            if (this.genresList[j].id == arrayGenres[i].id) {
                                cont++;
                                break;
                            }
                        }
                        if (cont == 0) {
                            this.genresList.push(arrayGenres[i])
                        }
                    }

                    this.filterByGenre();
                }).catch(() => {
                    console.log('Errore: acquisizione generi filtro');
                });
            },
            // Filtraggio per genere metodo iniziale
            filterByGenre: function () {
                let loopFilmsList = [];
                let loopSeriesList = [];

                // Memorizzo la lista completa al primo filtraggio
                if (this.counterFilterFilm == 0) {
                    this.oldFilmList = [...this.filmList];
                    this.OldSeriesList = [...this.serieList];
                    this.counterFilterFilm ++;
                }
                if (this.counterFilterSerie == 0) {
                    this.oldFilmList = [...this.filmList];
                    this.OldSeriesList = [...this.serieList];
                    this.counterFilterSerie ++;
                }
                
                // Se ho un filtro richiamo la funzione
                if (this.filter != 0) {
                    loopFilmsList = [...this.oldFilmList];
                    loopSeriesList = [...this.OldSeriesList]
                    this.filterMethod(loopFilmsList, loopSeriesList);
                }
                // Altrimenti risetto la lista con i compenenti iniziali
                else{
                    this.filmList = [...this.oldFilmList];
                    this.serieList = [...this.OldSeriesList];
                }

                // Moltiplicatore swipe azzerato
                this.carouselCounterFilms = 1;
                
                this.carousel('film');
                this.carousel('serie');
            },
            // Filtraggio per genere metodo finale
            filterMethod: function (loopFilmsList, loopSeriesList) {
                let filteredFilms = [];
                let filteredSeries = [];

                // Se un genere del film corrisponde al filtro lo inserisco in lista
                for(const key in loopFilmsList) {
                    for (let i = 0; i < loopFilmsList[key].genre_ids.length; i++) {
                        if (this.filter == loopFilmsList[key].genre_ids[i]) {
                            filteredFilms.push(loopFilmsList[key]);
                        }
                    }
                }
                for(const key in loopSeriesList) {
                    for (let i = 0; i < loopSeriesList[key].genre_ids.length; i++) {
                        if (this.filter == loopSeriesList[key].genre_ids[i]) {
                            console.log(loopSeriesList[key].genre_ids[i]);
                            
                            filteredSeries.push(loopSeriesList[key]);
                        }
                    }
                }

                console.log(loopSeriesList);
                this.filmList = [...filteredFilms];
                this.serieList = [...filteredSeries];
            },
            // Funzione finestra modale box trailer
            modalView: function (item, type) {
                this.modalActive = true;
                this.modalItem = item;
                this.modalType = type;
                this.imageLink = '';

                axios.get('https://api.themoviedb.org/3/' + type + '/' + item.id +  '/videos',
                {
                    params:{
                        api_key: this.api_key,
                        language: 'en-US'
                    }
                }).then(data => {
                    console.log('Modal', data.data.results, item);

                    if(this.viewWidth <= 767){
                        this.videoActive = false;
                        console.log('Video forbidden - View Width < 576px');
                    }
                    else if (data.data.results.length > 0) {
                        for (let i = 0; i < data.data.results.length; i++) {
                            const video = data.data.results[i];
                            if (video.type == 'Trailer') {
                                console.log('TRAILER FOUND', video.type);
                                this.videoLink = video.key;
                                this.videoActive = true;
                                break;
                            }
                            else{
                                this.videoActive = false;
                                console.log('No trailer found');
                            }
                        }
                    }else{
                        this.videoActive = false;
                        console.log('No video');
                    }

                    if (!this.videoActive) {
                        axios.get('https://api.themoviedb.org/3/' + type + '/' + item.id +  '/images',
                        {
                            params:{
                                api_key: this.api_key,
                                // language: 'en-US'
                            }
                        }).then(data => {
                            console.log(data.data);
                            if (data.data.backdrops.length > 0) {
                                this.imageLink = data.data.backdrops[0].file_path;
                            }else if (data.data.posters.length > 0){
                                this.imageLink = data.data.posters[0].file_path;
                            }else{
                                console.log('NO IMAGE DAMNT IT');
                            }

                            console.log(this.imageLink);
                        }).catch(() => {
                            console.log('Errore: modale immagine trailer');
                        });
                    }
                    this.actorsAndGenres(item.id, type);
                }).catch(() => {
                    console.log('Errore: modale video trailer');
                });
            },
            closeModalView: function () {
                console.log('clooose');
                this.videoLink =  null;
                this.modalActive = false;
                this.videoActive = false;
                this.imageLink = '';
            },
        }
    });
}

document.addEventListener('DOMContentLoaded', martinosflix);