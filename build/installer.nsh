Function .onVerifyInstDir
  StrCpy $0 $INSTDIR "" -11
  StrCmp $0 "\FolderTree" done

  StrCpy $0 $INSTDIR "" -1
  StrCmp $0 "\" noSlash
  StrCpy $INSTDIR "$INSTDIR\FolderTree"
  Goto done

noSlash:
  StrCpy $INSTDIR "$INSTDIR\FolderTree"

done:
FunctionEnd
