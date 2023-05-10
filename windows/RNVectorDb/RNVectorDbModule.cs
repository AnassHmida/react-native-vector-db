using ReactNative.Bridge;
using System;
using System.Collections.Generic;
using Windows.ApplicationModel.Core;
using Windows.UI.Core;

namespace Vector.Db.RNVectorDb
{
    /// <summary>
    /// A module that allows JS to share data.
    /// </summary>
    class RNVectorDbModule : NativeModuleBase
    {
        /// <summary>
        /// Instantiates the <see cref="RNVectorDbModule"/>.
        /// </summary>
        internal RNVectorDbModule()
        {

        }

        /// <summary>
        /// The name of the native module.
        /// </summary>
        public override string Name
        {
            get
            {
                return "RNVectorDb";
            }
        }
    }
}
