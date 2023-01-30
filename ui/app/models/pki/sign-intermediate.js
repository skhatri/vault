import { attr } from '@ember-data/model';
import { withFormFields } from 'vault/decorators/model-form-fields';
import { withModelValidations } from 'vault/decorators/model-validations';
import PkiCertificateBaseModel from './certificate/base';

const validations = {
  csr: [{ type: 'presence', message: 'CSR is required.' }],
};
@withModelValidations(validations)
@withFormFields([
  'csr',
  'useCsrValues',
  'commonName',
  'customTtl',
  'notBeforeDuration',
  'format',
  'permittedDnsDomains',
  'maxPathLength',
])
export default class PkiSignIntermediateModel extends PkiCertificateBaseModel {
  getHelpUrl(backend) {
    return `/v1/${backend}/issuer/example/sign-intermediate?help=1`;
  }

  @attr issuerRef;

  @attr('string', {
    label: 'CSR',
    editType: 'textarea',
    subText: 'The PEM-encoded CSR to be signed.',
  })
  csr;

  @attr('boolean', {
    label: 'Use CSR values',
    subText:
      'Subject information and key usages specified in the CSR will be used over parameters provided here, and extensions in the CSR will be copied into the issued certificate.',
    docLink: '/vault/api-docs/secret/pki#use_csr_values',
  })
  useCsrValues;

  @attr({
    label: 'Not valid after',
    detailsLabel: 'Issued certificates expire after',
    subText:
      'The time after which this certificate will no longer be valid. This can be a TTL (a range of time from now) or a specific date.',
    editType: 'yield',
  })
  customTtl;

  @attr({
    label: 'Backdate validity',
    detailsLabel: 'Issued certificate backdating',
    helperTextDisabled: 'Vault will use the default value, 30s',
    helperTextEnabled:
      'Also called the not_before_duration property. Allows certificates to be valid for a certain time period before now. This is useful to correct clock misalignment on various systems when setting up your CA.',
    editType: 'ttl',
    defaultValue: '30s',
  })
  notBeforeDuration;

  @attr('string')
  commonName;

  @attr({
    label: 'Permitted DNS domains',
    subText:
      'DNS domains for which certificates are allowed to be issued or signed by this CA certificate. Enter each value as a new input.',
  })
  permittedDnsDomains;

  @attr({
    subText: 'Specifies the maximum path length to encode in the generated certificate. -1 means no limit',
    defaultValue: '-1',
  })
  maxPathLength;

  /* Signing Options overrides */
  @attr({
    label: 'Use PSS',
    subText:
      'If checked, PSS signatures will be used over PKCS#1v1.5 signatures when a RSA-type issuer is used. Ignored for ECDSA/Ed25519 issuers.',
  })
  usePss;

  @attr({
    label: 'Subject Key Identifier (SKID)',
    subText:
      'Value for the subject key identifier, specified as a string in hex format. If this is empty, Vault will automatically calculate the SKID. ',
  })
  skid;

  @attr({
    possibleValues: ['0', '256', '384', '512'],
  })
  signatureBits;
}
