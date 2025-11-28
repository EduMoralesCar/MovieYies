export const getMyList = () => {
    const list = localStorage.getItem('myList');
    return list ? JSON.parse(list) : [];
};

export const addToMyList = (movie) => {
    const list = getMyList();
    if (!list.find(item => item.id === movie.id)) {
        list.push(movie);
        localStorage.setItem('myList', JSON.stringify(list));
        return true;
    }
    return false;
};

export const removeFromMyList = (movieId) => {
    const list = getMyList();
    const newList = list.filter(item => item.id !== movieId);
    localStorage.setItem('myList', JSON.stringify(newList));
    return newList;
};

export const isInMyList = (movieId) => {
    const list = getMyList();
    return !!list.find(item => item.id === movieId);
};
