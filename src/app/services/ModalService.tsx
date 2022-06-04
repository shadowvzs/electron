import React from "react";
import ReactDOM from "react-dom";
import { injectable } from "inversify";
import { IModalConfig, ModalProps } from "../interfaces/config";
import { IModalService } from "../interfaces/services";
import 'reflect-metadata';

const styles: Record<'overlay' | 'modal' | 'header' | 'close', React.CSSProperties> = {
    overlay: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        justifyContent: 'center',
        alignItems: 'center',
        bottom: 0,
        flexDirection: 'row',
        display: 'flex',
        background: 'rgba(0,0,0,0.35)'
    },
    modal: {
        background: 'white',
        border: '1px solid rgba(0,0,0,0.5)',
        position: 'relative',
        minWidth: 200,
        minHeight: 100,
        boxShadow: '5px 5px 5px 5px rgb(0 0 0 / 25%)',
        borderRadius: 2,
    },
    header: {
        position: 'relative',
        background: '#004',
        padding: '6px 6px 6px 12px',
        color: 'white'
    },
    close: {
        position: 'absolute',
        background: 'red',
        top: 1,
        right: 1,
        bottom: 1,
        borderRadius: 4,
        fontSize: 26,
        fontWeight: 'bolder',
        fontFamily: 'arial',
        width: 27,
        textAlign: 'center',
        lineHeight: '26px',
        cursor: 'pointer',
    }
}

export let modalService: ModalService;

@injectable()
export class ModalService implements IModalService {
    private $container: HTMLElement;
    private config: IModalConfig;

    constructor() {
        modalService = this;
        this.open = this.open.bind(this);
    }

    public init(config: IModalConfig): this {
        this.config = config;
        const $container = document.querySelector<HTMLElement>(config.containerSelector);
        if (!$container) {
            throw new Error('Modal container not exist, check the containerSelector config at service init');
        }
        this.$container = $container;
        return this;
    }

    private modalFrame<P, R>(Cmp: (props: P & Pick<ModalProps<P, R>, 'onClose' | 'onSuccess'>) => JSX.Element, props: ModalProps<P, R>) {
        const { onCancel, onClose, onSuccess } = props;
        const baseProps = {
            ...props.data,
            app: this.config.app,
            onClose,
            onSuccess,
        } as P & Pick<ModalProps<P, R>, 'onClose' | 'onSuccess' | 'app'>;
        return (
            <div
                className="modal-overlay"
                style={styles.overlay}
                onClick={onCancel}
            >
                <section className="modal" style={styles.modal}>
                    <header style={styles.header}>
                        <span children={props.title} />
                        <span
                            className="modal-close"
                            style={styles.close}
                            dangerouslySetInnerHTML={{ __html: '&times;' }}
                            onClick={onClose}
                        />
                    </header>
                    <main>
                        <div><Cmp {...baseProps} /></div>
                    </main>
                </section>
            </div>
        );
    }

    public open<P, R>(Cmp: (props: P & Pick<ModalProps<P, R>, 'onClose' | 'onSuccess'>) => JSX.Element, props: Partial<ModalProps<P, R>>): Promise<R> {
        return new Promise((resolve, reject) => {
            const onCancel = (e: React.MouseEvent<HTMLElement>) => {
                if (e.currentTarget.className !== 'modal-overlay' || e.target !== e.currentTarget) { return; }
                e.preventDefault();
                e.stopPropagation();
                if (typeof props.onCancel === 'function') { props.onCancel(); }
                ReactDOM.unmountComponentAtNode(this.$container);
                reject();
            }

            const onClose = (e: React.MouseEvent<HTMLElement>) => {
                e.preventDefault();
                e.stopPropagation();
                if (typeof props.onClose === 'function') { props.onClose(); }
                ReactDOM.unmountComponentAtNode(this.$container);
                reject();
            }

            const onSuccess = (item: R) => {
                if (typeof props.onSuccess === 'function') { props.onSuccess(item); }
                ReactDOM.unmountComponentAtNode(this.$container);
                resolve(item);
            }

            ReactDOM.render(this.modalFrame<P, R>(Cmp, { ...props, onCancel, onClose, onSuccess } as ModalProps<P, R>), this.$container);
        });
    }
}
