import { BadRequestException } from '@nestjs/common';

// Bazadan keladigan har bir qator (row) uchun interface
export interface VendorTemplateRow {
  id: number;
  key: string;
  value: string | null;
  type: string;
  show: number;
  label: string | null;
  options: any[];
  mask: string | null;
  element: string;
  prefix: string | null;
  regex: string | null;
  is_required: number;
  placeholder: string | null;
  size: number | null;
  amount_type: string;
  min_amount: number | null;
  max_amount: number | null;
  order: number;
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

    // Bazadan kelgan har bir qator (input) bo'yicha aylanib chiqamiz
    for (const row of templateRows) {
      const key = row.key;
      const isRequired = Number(row.is_required) === 1;

      // Agar qator majburiy (required) bo'lmasa, uni tekshirish shart emas, o'tkazib yuboramiz
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

      // 4. Tekshiruv: Agar kalit umuman kelmagan bo'lsa yoki kelgan bo'lsa ham ichi bo'sh bo'lsa
      if (
        !isKeyExists ||
        userValue === undefined ||
        userValue === null ||
        String(userValue).trim() === ''
      ) {
        errors[key] = [`Поле "${fieldName}" обязательно для заполнения.`];
        continue;
      }

      // 5. Agar qiymat bor bo'lsa va bazadagi shu qatorda regex yozilgan bo'lsa, formatini tekshiramiz
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

    // 6. Agar kamida bitta xatolik topilsa, NestJS standart BadRequestException (400) otamiz
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
