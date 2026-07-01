import { BadRequestException } from '@nestjs/common';

// Bazadan keladigan har bir qator (row) uchun interface
export interface VendorTemplateRow {
  vendorId: number;
  key: string;
  value: string | null;
  type: string | null;
  show: number | null;
  label: string | null;
  labelUz: string | null;
  labelRu: string | null;
  labelEn: string | null;
  options: any | null;
  mask: string | null;
  element: string | null;
  prefix: string | null;
  regex: string | null;
  isRequired: number | null;
  placeholder: string | null;
  size: number | null;
  amountType: string | null;
  minAmount: string | null;
  maxAmount: string | null;
  order: number | null;
}

export class VendorFormValidatorHelper {
  /**
   * @param templateRows Bazadan kelgan barcha input qatorlari massivi
   * @param requestBody Requestdan kelgan butun tana (body)
   */
  static validateForm(
    templateRows: VendorTemplateRow[],
    requestBody: any,
  ): boolean {
    const errors: Record<string, string[]> = {};

    const vendorForm = requestBody?.vendor_form || {};

    for (const row of templateRows) {
      const key = row.key;
      const isRequired = Number(row.isRequired) === 1;

      if (!isRequired) {
        continue;
      }

      // Kalit so'zni (key) formadan ham qidiramiz
      let userValue: any = undefined;
      let isKeyExists = false;

      if (key in vendorForm) {
        userValue = vendorForm[key];
        isKeyExists = true;
      }

      const fieldName = row.label || key;

      if (
        !isKeyExists ||
        userValue === undefined ||
        userValue === null ||
        String(userValue).trim() === ''
      ) {
        errors[key] = [`Поле "${fieldName}" обязательно для заполнения.`];
        continue;
      }

      if (row.regex) {
        try {
          const regex = new RegExp(row.regex);
          if (!regex.test(String(userValue))) {
            errors[key] = [`Поле "${fieldName}" имеет неверный формат.`];
          }
        } catch (e) {
          console.error(`Xato regex aniqlandi (Key: ${key}): ${row.regex}`);
        }
      }
    }

    if (!requestBody.card_token || !requestBody.card_id) {
      if (Object.keys(errors).length > 0) {
        errors['card_data'] = [
          `Поле Карта ID или Карта Токен имеет неверный формат.`,
        ];
      }
    }

    if (Object.keys(errors).length > 0) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'Ошибка валидации формы вендора',
        errors: errors,
      });
    }

    return true;
  }
}
