const maintenanceList = [
  {
    no:'no',
    name:'name',
    number:'number',
    name2:'name2',
    person:'person',
    mobile:'mobile',
    statue:'statue',
  }
];

const tobeDealtdata = [
  {
    'serviceprovider':'serviceprovider',
    'personliable':'personliable',
    'contentdescription':'contentdescription',
    'assessmentType':'assessmentType',
    'firstlevelindicators':'firstlevelindicators',
    'secondaryindicators':'secondaryindicators',
    'detailedterms':'detailedterms',
    'assessmentscore':'assessmentscore',
    'timeoccurrence':'timeoccurrence',
    'currentprocessingsection':'currentprocessingsection',
  }
]

export default {
  'GET /api/quality/maintenanceList':maintenanceList,
  'GET /api/quality/tobeDealtdata':tobeDealtdata,
}