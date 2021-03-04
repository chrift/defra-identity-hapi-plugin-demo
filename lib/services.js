/**
 * A structure that allows a journey-name to be converted to a serviceId, default roleId and serviceName
 */
const serviceLookup = {
  chemicals: { roleId: 'e45f4250-c2cc-e811-a95b-000d3a29ba60', serviceId: 'c0ca7608-de9b-e811-a94f-000d3a3a8543', serviceName: 'Comply with UK REACH' }, // REACH Manager
  mmo: { roleId: '23016fc5-7acc-e811-a95b-000d3a29ba60', serviceId: 'b8717ec3-66b6-e811-a954-000d3a29b5de', serviceName: 'Fish Exports' }, // Admin User
  ipaffs: { roleId: '29072a8c-73b6-e811-a954-000d3a29b5de', serviceId: '8b5214ee-62b6-e811-a954-000d3a29b5de', serviceName: 'IPAFFS' }, // Notifier
  exports: { roleId: 'f830c35e-71b6-e811-a954-000d3a29b5de', serviceId: '34b46f99-66b6-e811-a954-000d3a29b5de', serviceName: 'Exporter Service' }, // Exporter
  certifier: { roleId: '14c9c4b4-8675-e911-a850-000d3ab4ffef', serviceId: '418e0099-8675-e911-a850-000d3ab4ffef', serviceName: 'Certifier Service' }, // Certifier
  plants: { roleId: 'f2a8f026-6df2-ea11-a815-000d3ab4653d', serviceId: 'a4d44b69-6bf2-ea11-a815-000d3ab4653d', serviceName: 'Apply for a Phytosanitary Certificate' } // Apply for a Phytosanitary Certificate
}
module.exports = serviceLookup
