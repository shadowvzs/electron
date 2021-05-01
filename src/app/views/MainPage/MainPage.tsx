import React, { useContext } from 'react';
import { PageHeader } from '@/app/componensts/Layout/PageHeader';
import { Loader } from '@/app/componensts/Loader/Loading';
import { AppContext } from '@/app/global/AppProvider';
import { observer } from 'mobx-react-lite';
import { PageBody } from '@/app/componensts/Layout/PageBody';

const MainPage = observer(() => {
    const globalStore = useContext(AppContext);

    if (globalStore.loading) {
        return <Loader />;
    }
  
    return (
        <div className="main-page">
            <PageBody />
            <PageHeader />
        </div>
    );
});

export default MainPage;
