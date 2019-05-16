import React, { useMemo, useState } from "react";

import { ConsentNotice } from "../../features/ConsentNotice";
import { UserAgreement } from "../../features/UserAgreement";

import { env } from "../../environment";

export const ConsentPage: React.FC<{}> = () => {
    const consentOpts = useMemo(() => env().consentNotice, []);
    const agreementsOpts = useMemo(() => env().userAgreement, []);

    const [isNoticeOpen, setNoticeOpen] = useState(true);
    const [isAgreementOpen, setAgreementOpen] = useState(false);

    const showUserAgreement = () => {
        setNoticeOpen(false);
        setAgreementOpen(true);
    };

    const showNotice = () => {
        setNoticeOpen(true);
        setAgreementOpen(false);
    };

    return (
        <>
            <ConsentNotice opts={consentOpts} isOpen={isNoticeOpen} showUserAgreement={showUserAgreement} />
            <UserAgreement opts={agreementsOpts} isOpen={isAgreementOpen} onClose={showNotice} />
        </>
    );
};
