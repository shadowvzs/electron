import { runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';
import React from 'react';

export interface InputProps extends Omit<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, 'onChange' | 'value'> {
    property?: string;
    model?: Record<string, any>;
    valueParser?: (v: string) => any;

    value?: any;
    onChange?: (value: any) => void;
}

const parseValue = (value: string, type: string, parser?: InputProps['valueParser']): any => {
    let parsedValue: any = value || '';
    if (parser) {
        parsedValue = parser(value);
    } else if (type === 'number') {
        parsedValue = isNaN(Number(value)) ? undefined : Number(value);
    }
    return parsedValue;
}

function InputCore({ property, model, value, type = 'text', onChange, valueParser, ...rest }: InputProps) {
    const onChangeHandler = React.useCallback((ev: React.FormEvent<HTMLInputElement>) => {
        const newValue = parseValue(ev.currentTarget.value, type, valueParser);
        if (onChange) {
            onChange(newValue);
        } else if (model && property) {
            runInAction(() => model[property] = newValue);
        }
    }, [onChange, valueParser, model, property, type]);

    return (
        <input
            {...rest}
            type={type}
            value={((model && property) ? model[property] : value) || ''}
            onChange={onChangeHandler}
        />
    );
};

export const Input = observer(InputCore);