import React, { useContext } from 'react';
import { VersItem } from '../Page/VersContainer';
import { translate } from '@/app/global/GlobalStore';
import { AppContext } from '@/app/global/AppProvider';
import { Loader } from '../Loader/Loading';
import { observer } from 'mobx-react-lite';


export const SearchResult = observer(() => {
    
    const { bibleService, navigate } = useContext(AppContext);
    const { store } = bibleService;

    return (
        <div style={{ position: 'relative', height: '100%' }}>
            {store.searchLoading && (<Loader style={{ top: '50%', transform: 'translate(-50%, -50%)', left: '50%' }} />)}
            {!store.searchLoading && store.searchResult.map(v => {
                const [bibleId, bookId, chapterId, versId] = v.longId.split('-');
                return (
                    <div 
                        style={{ padding: 16 }}
                        key={v.longId}
                        onClick={() => navigate(`/?bibleId=${bibleId}&bookId=${bookId}&chapterId=${chapterId}&versId=${versId}`)}
                    >
                        <h3 style={{ color: '#005', cursor: 'pointer' }}>{translate(`BOOKS.${bookId}.SHORT_NAME`) + ` ${chapterId}:${versId}`}</h3>
                        <VersItem vers={v} />
                    </div>
                );
            })}
        </div>
    );
});
