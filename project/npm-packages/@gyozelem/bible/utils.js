// const langSpecificCharacters = ["á", "é", "í", "ó", "ö", "ő", "ô", "õ", "ú", "ü", "ű", "Á", "É", "Í", "Ó", "Ö", "Ő", "Ú", "Ü", "Ű", "Ă", "Â", "Î", "Ş", "Ţ", "ă", "â", "î", "ş", "ţ"];
// const nonLangSpecificCharacters = ["a", "e", "i", "o", "o", "o", "o", "o", "u", "u", "u", "A", "E", "I", "O", "O", "O", "U", "U", "U", "A", "A", "I", "S", "T", "a", "a", "i", "s", "t"];
// wordMatchType: 'WHOLE_WORD' | 'START_WITH' | 'END_WITH' | 'PART_WORD';

export const removeLanguageSpecCharacters = (text) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
export const createSearchRegExps = (searchTerm, caseSensitive, wholeWord) => {
    const words = searchTerm.split(' ');
    const flags = caseSensitive ? 'g' : 'ig';
    return words.map(word => {
        const prefix = (wholeWord === 'WHOLE_WORD' || wholeWord === 'START_WITH') ? `(?<=[\\s,.:;"']|^)` : '';
        const sufix = (wholeWord === 'WHOLE_WORD' || wholeWord === 'END_WITH') ? `(?=[\\s,.:;"']|$)` : '';
        return new RegExp(prefix + word + sufix, flags);
    });
};
