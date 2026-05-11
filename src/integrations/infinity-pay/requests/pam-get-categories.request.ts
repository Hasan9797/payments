import { RequestMethodEnum } from '@/common/enums';
import { InfinityPayHttpClient } from '../http-client';
import { PamCategory, PamResponse } from '@/common/interfaces';

export class PamGetCategoriesRequest extends InfinityPayHttpClient {
  constructor() {
    super();
    this.setMethod(RequestMethodEnum.PAM_CATEGORIES)
      .setParams(null)
      .setIsLog(false);
  }

  getCategories() {
    const result = this.getResult();
    const categories = result.categories;

    return categories.map((category: PamCategory) => {
      return {
        title: category.title,
        logo: category.logo,
        status: 1,
        key: category.value,
      };
    });
  }
}
