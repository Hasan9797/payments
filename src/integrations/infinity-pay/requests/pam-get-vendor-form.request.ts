import { RequestMethodEnum } from '@/common/enums';
import { InfinityPayHttpClient } from '../http-client';

export class PamGetVendorFormRequest extends InfinityPayHttpClient {
  constructor(vendorId: number) {
    super();
    this.setMethod(RequestMethodEnum.PAM_VENDOR_FORM)
      .setParams({ vendors: { vendor_id: vendorId } })
      .setIsLog(true);
  }

  getVendorForm() {
    const result: any = this.getResult();
    const vendorForms = result?.vendor_form ?? [];
    const amountForm = vendorForms.find((item: any) => item.amount_field);
    let static_amount = 0;

    const arrayVendorForm = vendorForms.map((vendorForm: any) => {
      let show = vendorForm.show;
      let options: any[] = [];
      let value = null;
      try {
        if (typeof vendorForm.options === 'string') {
          options = JSON.parse(vendorForm.options);
        } else if (Array.isArray(vendorForm.options)) {
          options = vendorForm.options;
        } else {
          options = [];
        }
      } catch {
        options = [];
      }

      if (
        amountForm.amount_field &&
        vendorForm.key === amountForm.amount_field
      ) {
        value = vendorForm.min_amount;
        show = 0;
        static_amount = vendorForm.min_amount;
      }

      return {
        key: vendorForm.key ?? null,
        value: value ?? vendorForm.value,
        type: vendorForm.type ?? null,
        show: show,
        label: vendorForm.label ?? null,
        label_ru: vendorForm.label_ru ?? null,
        label_uz: vendorForm.label_uz ?? null,
        label_en: vendorForm.label_ru ?? null,
        options,
        element: vendorForm.element ?? 'input',
        mask: vendorForm.mask ?? null,
        prefix: vendorForm.prefix ?? null,
        regex: vendorForm.regex ?? null,
        is_required: vendorForm.is_required ?? 0,
        placeholder: vendorForm.placeholder ?? null,
        size: vendorForm.size ?? null,
        amount_type: vendorForm.amount_type ?? 'uzs',
        min_amount: vendorForm.min_amount ?? null,
        max_amount: vendorForm.max_amount ?? null,
        order: vendorForm.order ?? 0,
        account_field: vendorForm.account_field ?? null,
        amount_field: vendorForm.amount_field ?? null,
      };
    });
    return arrayVendorForm;
  }
}
