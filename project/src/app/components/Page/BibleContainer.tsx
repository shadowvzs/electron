import React from "react";
import { observer } from "mobx-react-lite";
import { AppContext } from '@/app/core/AppProvider';
import { BookContainer } from "./BookContainer";
import { ChapterContainer } from "./ChapterContainer";
import { VersContainer } from "./VersContainer";

export const BibleContainer = observer(() => {
    const { baseBible } = React.useContext(AppContext);

    if (!baseBible) { return null; }

    if (baseBible.currentChapter) {
        return <VersContainer />;
    } else if (baseBible.currentBook) {
        return <ChapterContainer />;
    } else {
        return <BookContainer />;
    }
});