import { RequestMethodEnum } from '@/common/enums';
import { InfinityPayHttpClient } from '../http-client';
import { PamVendor } from '@/common/interfaces';

export class PamCategoryVendorsRequest extends InfinityPayHttpClient {
  constructor(categoryId: number) {
    super();
    this.setMethod(RequestMethodEnum.PAM_CATEGORY_VENDORS)
      .setParams({
        categories: {
          category_id: categoryId,
        },
      })
      .setIsLog(false);
  }

  getVendors() {
    const response = this.getResponse();
    const vendors = response?.result.vendors;

    return vendors.map((vendor: PamVendor) => {
      return {
        vendor_id: vendor.value,
        name: vendor.name,
        short_name: vendor.short_name,
        url: vendor.url,
        logo: vendor.logo,
        status: 1,
        description: vendor.description,
        category_id: vendor.category_id,
        name_ru: vendor.name_ru,
        name_uz: vendor.name_uz,
        name_en: vendor.name_en,
        short_name_ru: vendor.short_name_ru,
        short_name_uz: vendor.short_name_uz,
        short_name_en: vendor.short_name_en,
      };
    });
  }
}
