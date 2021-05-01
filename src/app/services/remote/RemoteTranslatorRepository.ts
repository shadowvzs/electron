import { BaseTranslatorRepository, ITranslation } from "../BaseTranslatorRepository";

export class RemoteTranslatorRepository extends BaseTranslatorRepository {
    public async getTranslations(): Promise<ITranslation> {
        throw new Error('not implemented');
    }
}
