export namespace Tracers {
    export interface Name {
        Prefix: string;
        FirstName: string;
        MiddleName: string;
        LastName: string;
        Suffix: string;
        PublicFirstSeenDate: string;
        TotalFirstSeenDate: string;
        SourceSummary?: any;
    }

    export interface SocialSecurityNumber {
        Ssn: string;
        Dates: string;
        Location: string;
        AlternateLocation: string;
        SourceSummary?: any;
    }

    export interface DatesOfBirth {
        Dob: string;
        Age: number;
        SourceSummary?: any;
    }

    export interface DeathRecords {
        IsDeceased: boolean;
        SourceSummary?: any;
    }

    export interface Aka {
        Prefix: string;
        FirstName: string;
        MiddleName: string;
        LastName: string;
        Suffix: string;
        PublicFirstSeenDate: string;
        TotalFirstSeenDate: string;
        SourceSummary?: any;
    }

    export interface MergedName {
        Prefix: string;
        FirstName: string;
        MiddleName: string;
        LastName: string;
        Suffix: string;
        PublicFirstSeenDate?: any;
        TotalFirstSeenDate?: any;
        SourceSummary?: any;
    }

    export interface Location {
        City: string;
        State: string;
    }

    export interface HighRiskMarker {
        IsHighRisk: boolean;
        Sic: string;
        AddressType: string;
    }

    export interface Address {
        IsDeliverable: boolean;
        IsMergedAddress: boolean;
        IsPublic: boolean;
        AddressQualityCodes: any[];
        AddressHash: string;
        HouseNumber: string;
        StreetPreDirection: string;
        StreetName: string;
        StreetPostDirection: string;
        StreetType: string;
        Unit: string;
        UnitType?: any;
        City: string;
        State: string;
        County: string;
        Zip: string;
        Zip4: string;
        Latitude: string;
        Longitude: string;
        AddressOrder: number;
        HighRiskMarker: HighRiskMarker;
        FirstReportedDate: string;
        LastReportedDate: string;
        PublicFirstSeenDate: string;
        TotalFirstSeenDate: string;
        PhoneNumbers: string[];
        Neighbors: any[];
        NeighborSummaryRecords: any[];
        FullAddress: string;
        SourceSummary?: any;
    }

    export interface PhoneNumber {
        PhoneNumber: string;
        Company: string;
        Location: string;
        PhoneType: string;
        IsConnected: boolean;
        IsPublic: boolean;
        Latitude: string;
        Longitude: string;
        PhoneOrder: number;
        FirstReportedDate: string;
        LastReportedDate: string;
        PublicFirstSeenDate?: any;
        TotalFirstSeenDate: string;
        SourceSummary?: any;
    }

    export interface EmailAddress {
        EmailAddress: string;
        EmailOrdinal: number;
        SourceSummary?: any;
    }

    export interface RelativesSummary {
        TahoeId: string;
        Prefix: string;
        FirstName: string;
        MiddleName: string;
        LastName: string;
        Suffix: string;
        Dob: string;
        RelativeLevel: string;
        RelativeType: string;
        Spouse: number;
        SharedHouseholdIds: string[];
        Score: number;
    }

    export interface AssociatesSummary {
        TahoeId: string;
        Prefix: string;
        FirstName: string;
        MiddleName: string;
        LastName: string;
        Suffix: string;
        Dob: string;
        Score: number;
    }

    export interface Indicators {
        HasBankruptcyRecords: number;
        HasBusinessRecords: number;
        HasDivorceRecords: number;
        HasDomainsRecords: number;
        HasEvictionsRecords: number;
        HasFeinRecords: number;
        HasForeclosuresRecords: number;
        HasJudgmentRecords: number;
        HasLienRecords: number;
        HasMarriageRecords: number;
        HasProfessionalLicenseRecords: number;
        HasPropertyRecords: number;
        HasVehicleRegistrationsRecords: number;
        HasWorkplaceRecords: number;
        HasDeaRecords: number;
    }

    export interface RootObject {
        TahoeId: string;
        Name: Name;
        IsPublic: boolean;
        IsOptedOut: boolean;
        SparseFlag: number;
        Ssn: string;
        SsnDates: string;
        SsnLocation: string;
        SsnAlternateLocation: string;
        SocialSecurityNumbers: SocialSecurityNumber[];
        Dob: string;
        Age: number;
        DatesOfBirth: DatesOfBirth[];
        DatesOfDeath: any[];
        DeathRecords: DeathRecords;
        Akas: Aka[];
        MergedNames: MergedName[];
        Locations: Location[];
        Addresses: Address[];
        PhoneNumbers: PhoneNumber[];
        EmailAddresses: EmailAddress[];
        RelativesSummary: RelativesSummary[];
        AssociatesSummary: AssociatesSummary[];
        FullName: string;
        Indicators: Indicators;
    }
};

